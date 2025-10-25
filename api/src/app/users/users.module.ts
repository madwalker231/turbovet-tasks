import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Organization } from '../database/entities/organization.entity';
import { Task } from '../database/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, Task])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
