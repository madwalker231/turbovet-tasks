import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Task } from './task.entity';
// This imports from the library we just created!
import { UserRole } from '@turbovet-tasks/data-models';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Don't return password by default
  password: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  // --- Relationships ---
  @ManyToOne(() => Organization, (org) => org.users, { nullable: false })
  organization: Organization;

  @Column()
  organizationId: string;

  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks: Task[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks: Task[];

  // --- Hooks ---
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
