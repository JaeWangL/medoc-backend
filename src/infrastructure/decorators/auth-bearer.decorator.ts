import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthBearer = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const { headers } = ctx.switchToHttp().getRequest();

  return headers.authorization.split(' ')[1];
});
