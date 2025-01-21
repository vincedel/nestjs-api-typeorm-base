import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadDto } from '../dto/user-payload.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserPayloadDto => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
