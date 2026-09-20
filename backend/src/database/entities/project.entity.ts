import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ProjectMember } from './project-member.entity';

export enum ProjectStatus {
  PLANNING = 'Planning',
  ACTIVE = 'Active',
  ON_HOLD = 'On-Hold',
  COMPLETED = 'Completed',
  CLOSED = 'Closed',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** BR01: Mã dự án duy nhất trong toàn hệ thống */
  @Column({ unique: true, length: 50 })
  projectCode: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status: ProjectStatus;

  /** BR01: end_date >= start_date — validated at service level */
  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget: number;

  /** Mục tiêu dự án (BP003 - PARTIAL) */
  @Column({ type: 'text', nullable: true })
  objectives: string;

  /** Ghi chú Baseline timeline (BP004) */
  @Column({ type: 'text', nullable: true })
  timelineNote: string;

  /** PM phụ trách */
  @Column({ nullable: true })
  pmId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'pmId' })
  pm: User;

  @OneToMany(() => ProjectMember, (m) => m.project)
  members: ProjectMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
