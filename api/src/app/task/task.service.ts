import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../database/entities/task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { RequestUser } from "../auth/type/request-user.type";
import { UserRole } from "@turbovet-tasks/data-models";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(CreateTaskDto: CreateTaskDto, user: RequestUser) {
    const task = this.taskRepository.create({
      ...CreateTaskDto,
      organizationId: user.organizationId,
      createdById: user.userId,
    });
    return this.taskRepository.save(task);
  }

  findAll(user: RequestUser) {
    return this.taskRepository.find({
      where: {
        organizationId: user.organizationId,
      }
    });
  }

  async findOne(id: string, user: RequestUser) {
    const task = await this.taskRepository.findOne({
      where: {
        id: id,
        organizationId: user.organizationId,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`)
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: RequestUser) {
    const task = await this.findOne(id, user);
    const updateTask = this.taskRepository.merge(task, updateTaskDto);
    return this.taskRepository.save(updateTask);
  }

  async remove(id: string, user: RequestUser) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("You do not have permission to delete tasks.");
    }
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully.' };
  }
}
