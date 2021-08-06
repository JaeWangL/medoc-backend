import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import chalk from 'chalk';

const primaryColor = '#87e8de';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (req) {
      return this.handleRestApi(context, next, req);
    }

    return this.handleGraphql(context, next);
  }

  private handleRestApi(context: ExecutionContext, next: CallHandler, req: any): Observable<any> {
    const { method, url } = req;
    return next.handle().pipe(tap(() => Logger.debug(`${method} ${url}`, context.getClass().name)));
  }

  private handleGraphql(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getArgs()[3]) {
      const { parentType } = context.getArgs()[3];
      const fieldName = chalk.hex(primaryColor).bold(`${context.getArgs()[3].fieldName}`);
      return next.handle().pipe(
        tap(() => {
          Logger.debug(`${parentType} » ${fieldName}`, 'GraphQL');
        }),
      );
    }
    const parentType = chalk.hex(primaryColor).bold(`${context.getArgs()[0].route.path}`);
    const fieldName = chalk.hex(primaryColor).bold(`${context.getArgs()[0].route.stack[0].method}`);
    return next.handle().pipe(
      tap(() => {
        Logger.debug(`${parentType} » ${fieldName}`, 'GraphQL');
      }),
    );
  }
}
