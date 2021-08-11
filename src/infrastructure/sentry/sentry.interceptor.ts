import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpArgumentsHost, WsArgumentsHost, RpcArgumentsHost } from '@nestjs/common/interfaces';
import type { GqlContextType } from '@nestjs/graphql';
import { Scope } from '@sentry/hub';
import { Handlers } from '@sentry/node';
import { SentryService } from './sentry.service';

/* eslint-disable no-empty, global-require */
let GqlExecutionContext: any;
try {
  ({ GqlExecutionContext } = require('@nestjs/graphql'));
  // eslint-disable-next-line no-empty
} catch (e) {}
/* eslint-enable */

@Injectable()
export class GraphqlInterceptor implements NestInterceptor {
  private client: SentryService = SentryService.SentryServiceInstance();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // first param would be for events, second is for errors
    return next.handle().pipe(
      tap({
        error: (exception) => {
          // eslint-disable-next-line consistent-return
          this.client.instance().withScope((scope) => {
            // eslint-disable-next-line default-case
            switch (context.getType<GqlContextType>()) {
              case 'http':
                return this.captureHttpException(scope, context.switchToHttp(), exception);
              case 'rpc':
                return this.captureRpcException(scope, context.switchToRpc(), exception);
              case 'ws':
                return this.captureWsException(scope, context.switchToWs(), exception);
              case 'graphql':
                return this.captureGraphqlException(scope, GqlExecutionContext.create(context), exception);
            }
          });
        },
      }),
    );
  }

  private captureHttpException(scope: Scope, http: HttpArgumentsHost, exception: any): void {
    const data = Handlers.parseRequest(<any>{}, http.getRequest(), {});

    scope.setExtra('req', data.request);

    if (data.extra) scope.setExtras(data.extra);
    if (data.user) scope.setUser(data.user);

    this.client.instance().captureException(exception);
  }

  private captureRpcException(scope: Scope, rpc: RpcArgumentsHost, exception: any): void {
    scope.setExtra('rpc_data', rpc.getData());

    this.client.instance().captureException(exception);
  }

  private captureWsException(scope: Scope, ws: WsArgumentsHost, exception: any): void {
    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());

    this.client.instance().captureException(exception);
  }

  private captureGraphqlException(scope: Scope, gqlContext: typeof GqlExecutionContext, exception: any): void {
    const info = gqlContext.getInfo();
    const context = gqlContext.getContext();

    scope.setExtra('type', info.parentType.name);

    if (context.req) {
      // req within graphql context needs modification in
      const data = Handlers.parseRequest(<any>{}, context.req, {});

      scope.setExtra('req', data.request);

      if (data.extra) scope.setExtras(data.extra);
      if (data.user) scope.setUser(data.user);
    }

    this.client.instance().captureException(exception);
  }
}
