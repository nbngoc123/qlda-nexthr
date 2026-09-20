import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  SOFT_DELETE = 'SOFT_DELETE',
  ASSIGN = 'ASSIGN',
}

/**
 * BR07: Mọi thao tác biến động dữ liệu phải ghi AuditLog
 * trong cùng Database Transaction.
 */
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Bảng bị tác động: 'Project', 'WorkItem', 'Epic', ... */
  @Column({ length: 50 })
  entityName: string;

  @Column()
  entityId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  /** Field-level delta: Old Value (JSONB) */
  @Column({ type: 'jsonb', nullable: true })
  oldData: Record<string, any>;

  /** Field-level delta: New Value (JSONB) */
  @Column({ type: 'jsonb', nullable: true })
  newData: Record<string, any>;

  @Column()
  actorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actorId' })
  actor: User;

  @CreateDateColumn()
  createdAt: Date;
}
