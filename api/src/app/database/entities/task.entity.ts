import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
// This also imports from our shared library
import { TaskStatus } from '@turbovet-tasks/data-models';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // --- Relationships ---
  @ManyToOne(() => Organization, (org) => org.tasks, { nullable: false })
  organization: Organization;

  @Column()
  organizationId: string;

  @ManyToOne(() => User, (user) => user.createdTasks, { nullable: false })
  createdBy: User;

  @Column()
  createdById: string;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;
}
