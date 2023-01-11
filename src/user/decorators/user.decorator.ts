import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (param: string, ctx: ExecutionContext) => {
    const {
      headers: { user },
    } = ctx.switchToHttp().getRequest();

    return user[param] || user;
  },
);
