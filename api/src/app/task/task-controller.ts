import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { TasksService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@turbovet-tasks/data-models";
import { GetUser } from "../auth/decorators/user.decorator";
import { RequestUser } from "../auth/type/request-user.type";

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MEMBER)
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: RequestUser) {
    return this.taskService.create(createTaskDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MEMBER, UserRole.VIEWER)
  findAll(@GetUser() user:RequestUser) {
    return this.taskService.findAll(user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MEMBER, UserRole.VIEWER)
  findOne(@Param('id') id: string, @GetUser() user: RequestUser) {
    return this.taskService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MEMBER)
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: RequestUser,
  ) {
    return this.taskService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: RequestUser) {
    return this.taskService.remove(id, user);
  }
}
