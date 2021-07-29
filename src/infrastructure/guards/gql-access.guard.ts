import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { RolesEnum } from '@infrastructure/decorators';

@Injectable()
export class GqlAccessGuard extends AuthGuard('accessToken') {
  getRequest(context: ExecutionContext): any {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    console.log(req);
    console.log(req.user);
    return Boolean(req.user && Object.values(RolesEnum).includes(req.user.role));
  }
}
