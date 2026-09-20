import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Epic } from './epic.entity';
import { Milestone } from './milestone.entity';
import { User } from './user.entity';

export enum WorkItemType {
  TASK = 'Task',
  BUG = 'Bug',
  CR = 'CR',
  SUBTASK = 'Subtask',
}

export enum WorkItemPriority {
  URGENT = 'Urgent',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum WorkItemStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In-Progress',
  IN_REVIEW = 'In Review',
  REJECT = 'Reject',
  APPROVED_DONE = 'Approved-Done',
  PENDING = 'Pending',
  CANCEL = 'Cancel',
}

@Entity('work_items')
export class WorkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ nullable: true })
  epicId: string;

  @ManyToOne(() => Epic, { nullable: true })
  @JoinColumn({ name: 'epicId' })
  epic: Epic;

  @Column({ nullable: true })
  milestoneId: string;

  @ManyToOne(() => Milestone, { nullable: true })
  @JoinColumn({ name: 'milestoneId' })
  milestone: Milestone;

  /** Tự tham chiếu: Subtask -> Task cha */
  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => WorkItem, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: WorkItem;

  /** Mã công việc duy nhất, VD: INDA_TTS-00001 */
  @Column({ unique: true, length: 50 })
  itemCode: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  acceptanceCriteria: string;

  @Column({ type: 'enum', enum: WorkItemType, default: WorkItemType.TASK })
  type: WorkItemType;

  @Column({
    type: 'enum',
    enum: WorkItemPriority,
    default: WorkItemPriority.MEDIUM,
  })
  priority: WorkItemPriority;

  @Column({
    type: 'enum',
    enum: WorkItemStatus,
    default: WorkItemStatus.TODO,
  })
  status: WorkItemStatus;

  /** BR03: assigneeId != reviewerId */
  @Column({ nullable: true })
  assigneeId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigneeId' })
  assignee: User;

  @Column({ nullable: true })
  reviewerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewerId' })
  reviewer: User;

  /** BR02: startDate <= deadline <= milestone.dueDate */
  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({ type: 'float', default: 0 })
  estimatedHours: number;

  /**
   * BR04: Member chỉ cập nhật 0-90%
   * 100% chỉ được set tự động khi Reviewer Approve
   */
  @Column({ type: 'int', default: 0 })
  progressPercentage: number;

  @Column({ length: 500, nullable: true })
  deliveryLink: string;

  @Column({ type: 'text', nullable: true })
  issueNote: string;

  /** Ghi chú lý do thay đổi ưu tiên (BP016) */
  @Column({ type: 'text', nullable: true })
  priorityNote: string;

  /** BR06: Soft Delete - KHÔNG xóa cứng */
  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  deletedBy: string;

  @Column({ type: 'text', nullable: true })
  deletionReason: string;

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
