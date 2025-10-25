import { Controller, Post, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@turbovet-tasks/data-models";
import { GetUser } from "../auth/decorators/user.decorator";
import { RequestUser } from "../auth/type/request-user.type";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body() CreateUserDto: CreateUserDto,
    @GetUser() adminUser: RequestUser,
  ) {
    return this.userService.create(CreateUserDto, adminUser);
  }
}
