import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestUser } from "../type/request-user.type";

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
)
