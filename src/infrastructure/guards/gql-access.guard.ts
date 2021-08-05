import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAccessGuard extends AuthGuard('accessToken') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
}
