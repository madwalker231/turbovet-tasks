import { Module } from "@nestjs/common";
import { TasksService } from './task.service';
import { TasksController } from './task-controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from '../database/entities/task.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TaskModule {}
