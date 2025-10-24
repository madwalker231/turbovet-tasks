import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Organization } from './database/entities/organization.entity';
import { User } from './database/entities/user.entity';
import { Task } from './database/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'sqlite',
      database: 'db.sqlite',
      entities: [Organization, User, Task],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
