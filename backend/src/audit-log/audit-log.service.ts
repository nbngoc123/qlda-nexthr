import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  AuditLog,
  AuditAction,
} from '../database/entities/audit-log.entity';

/**
 * BR07: Audit Log Engine
 * Bắt buộc gọi trong cùng EntityManager (Transaction) với thao tác chính.
 *
 * Usage:
 *   await this.auditLogService.log(manager, {
 *     entityName: 'WorkItem',
 *     entityId: workItem.id,
 *     action: AuditAction.UPDATE,
 *     oldData: { status: 'To Do' },
 *     newData: { status: 'In-Progress' },
 *     actorId: currentUser.id,
 *   });
 */
@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  async log(
    manager: EntityManager,
    params: {
      entityName: string;
      entityId: string;
      action: AuditAction;
      oldData?: Record<string, any>;
      newData?: Record<string, any>;
      actorId: string;
    },
  ): Promise<AuditLog> {
    const log = manager.create(AuditLog, {
      entityName: params.entityName,
      entityId: params.entityId,
      action: params.action,
      oldData: params.oldData ?? null,
      newData: params.newData ?? null,
      actorId: params.actorId,
    });
    return manager.save(AuditLog, log);
  }

  /** Truy vấn lịch sử của một entity */
  async findByEntity(entityName: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepo.find({
      where: { entityName, entityId },
      order: { createdAt: 'DESC' },
    });
  }
}
