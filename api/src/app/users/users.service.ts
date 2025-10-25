import { BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { RequestUser } from "../auth/type/request-user.type";
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../database/entities/user.entity";
import { Organization } from "../database/entities/organization.entity";
import { Task } from "../database/entities/task.entity";
import { Repository } from "typeorm";
import { UserRole, TaskStatus } from "@turbovet-tasks/data-models";

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger (UsersService.name)

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async onModuleInit() {
    const adminUser = await this.usersRepository.findOne({
      where: { email: 'admin@test.com' },
    });
    if (!adminUser) {
      this.logger.log('No admin user found. Creating test data...');
      const org = this.orgRepository.create({ name: 'Test Org' });
      await this.orgRepository.save(org);
      this.logger.log(`Created organization: ${org.name}`);

      const admin = this.usersRepository.create({
        email: 'admin@test.com',
        password: 'password123',
        role: UserRole.ADMIN,
        organization: org,
      });
      await this.usersRepository.save(admin);
      this.logger.log(`Created admin user: ${admin.email}`);

      const viewer = this.usersRepository.create({
        email: 'viewer@test.com',
        password: 'password123',
        role: UserRole.VIEWER,
        organization: org,
      });
      await this.usersRepository.save(viewer);
      this.logger.log(`Created viewer user: ${viewer.email}`);

      const task = this.taskRepository.create({
        title: 'My First Test Task',
        description: 'This is a task to be deleted.',
        status: TaskStatus.TODO,
        organization: org,
        createdBy: admin,
      });
      await this.taskRepository.save(task);
      this.logger.log(`Created test task: ${task.title}`);
    }
  }

  async create(createUserDto: CreateUserDto, adminUser: RequestUser) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email},
    });

    if  (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    const newUser = this.usersRepository.create({
      ...createUserDto,
      // Forced organization-level scoping. New users is *always* in the admin's org.
      organizationId: adminUser.organizationId,
    });

    await this.usersRepository.save(newUser);

    const { password, ...result } = newUser;
    return result;
  }


  /**
   * Finds User by email, and explicitly includes the password.
   */
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}
