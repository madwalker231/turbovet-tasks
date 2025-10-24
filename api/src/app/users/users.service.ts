import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../database/entities/user.entity";
import { Organization } from "../database/entities/organization.entity";
import { Repository } from "typeorm";
import { UserRole } from "@turbovet-tasks/data-models";

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger (UserService.name)

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
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

      const user = this.usersRepository.create({
        email: 'admin@test.com',
        password: 'password123',
        role: UserRole.ADMIN,
        organization: org,
      });
      await this.usersRepository.save(user);
      this.logger.log(`Created admin user: ${user.email}`);
    }
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
