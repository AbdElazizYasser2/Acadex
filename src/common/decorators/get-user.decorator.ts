import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthJwtPayload } from '../../auth/auth.service';

export const GetUser = createParamDecorator(
  (data: keyof AuthJwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthJwtPayload }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
