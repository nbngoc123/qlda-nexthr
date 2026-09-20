import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  WorkItem,
  WorkItemStatus,
  WorkItemPriority,
} from '../../database/entities/work-item.entity';
import { Project, ProjectStatus } from '../../database/entities/project.entity';
import { Epic } from '../../database/entities/epic.entity';
import { Milestone } from '../../database/entities/milestone.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AuditAction } from '../../database/entities/audit-log.entity';
import {
  CreateWorkItemDto,
  UpdateWorkItemDto,
  AssignMembersDto,
  SetDeadlineDto,
  SetPriorityDto,
  UpdateProgressDto,
  ChangeStatusDto,
  DeleteWorkItemDto,
} from './dto/work-item.dto';
import { UserRole } from '../../database/entities/user.entity';

/** Trạng thái bị lock — không cho phép sửa thông tin gốc (BR05) */
const LOCKED_STATUSES = [
  WorkItemStatus.IN_REVIEW,
  WorkItemStatus.APPROVED_DONE,
  WorkItemStatus.CANCEL,
];

@Injectable()
export class WorkItemsService {
  constructor(
    @InjectRepository(WorkItem)
    private readonly workItemRepo: Repository<WorkItem>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Epic)
    private readonly epicRepo: Repository<Epic>,
    @InjectRepository(Milestone)
    private readonly milestoneRepo: Repository<Milestone>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    private readonly auditLogService: AuditLogService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * BP011 - Tạo Work Item
   * Actor: Team Lead (R03), PM (R02)
   * Rules: BR02 (timeline), BR03 (reviewer != assignee)
   */
  async create(
    projectId: string,
    dto: CreateWorkItemDto,
    actor: { id: string; role: string },
  ): Promise<WorkItem> {
    const project = await this.findProjectOrFail(projectId);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new ForbiddenException('Chỉ tạo Work Item khi dự án ở trạng thái Active');
    }

    await this.assertProjectMember(projectId, actor.id);

    // BR03: reviewer != assignee
    if (dto.assigneeId && dto.reviewerId && dto.assigneeId === dto.reviewerId) {
      throw new ConflictException('Người thực hiện và người duyệt không được là cùng một người (BR03)');
    }

    // Validate Assignee/Reviewer thuộc project
    if (dto.assigneeId) await this.assertMemberOfProject(projectId, dto.assigneeId, 'Assignee');
    if (dto.reviewerId) await this.assertMemberOfProject(projectId, dto.reviewerId, 'Reviewer');

    // BR02: timeline validation
    if (dto.startDate && dto.deadline) {
      if (new Date(dto.deadline) < new Date(dto.startDate)) {
        throw new UnprocessableEntityException('Deadline phải >= Start Date (BR02)');
      }
    }

    // Check deadline <= milestone.dueDate (BR02)
    if (dto.milestoneId && dto.deadline) {
      const milestone = await this.milestoneRepo.findOne({ where: { id: dto.milestoneId } });
      if (milestone && new Date(dto.deadline) > milestone.dueDate) {
        throw new UnprocessableEntityException(
          `Deadline vượt quá Due Date của Milestone (${milestone.dueDate.toISOString().slice(0, 10)}) — BR02`,
        );
      }
    }

    // Check deadline <= project.endDate (BR02)
    if (dto.deadline && project.endDate && new Date(dto.deadline) > project.endDate) {
      throw new UnprocessableEntityException('Deadline vượt quá ngày kết thúc dự án (BR02)');
    }

    return this.dataSource.transaction(async (manager) => {
      // Sinh item_code tự động: {PROJECT_CODE}-{sequence}
      const count = await manager.count(WorkItem, { where: { projectId } });
      const itemCode = `${project.projectCode}-${String(count + 1).padStart(5, '0')}`;

      const workItem = manager.create(WorkItem, {
        ...dto,
        projectId,
        itemCode,
        status: WorkItemStatus.TODO,
        progressPercentage: 0,
        createdById: actor.id,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
      });
      const saved = await manager.save(WorkItem, workItem);

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: saved.id,
        action: AuditAction.CREATE,
        newData: {
          itemCode: saved.itemCode,
          title: saved.title,
          type: saved.type,
          status: saved.status,
        },
        actorId: actor.id,
      });

      return saved;
    });
  }

  /**
   * BP013 - Cập nhật thông tin gốc Work Item
   * Actor: PM, Team Lead
   * BR05: Lock khi In-Review / Done / Cancelled
   */
  async update(
    id: string,
    dto: UpdateWorkItemDto,
    actor: { id: string; role: string },
  ): Promise<WorkItem> {
    const wi = await this.findOneOrFail(id);
    this.assertNotLocked(wi); // BR05

    await this.assertProjectMember(wi.projectId, actor.id);
    this.assertRoleIsManagerLevel(actor.role);

    // BR03
    const newAssignee = dto.assigneeId ?? wi.assigneeId;
    const newReviewer = dto.reviewerId ?? wi.reviewerId;
    if (newAssignee && newReviewer && newAssignee === newReviewer) {
      throw new ConflictException('Người thực hiện và người duyệt không được trùng nhau (BR03)');
    }

    return this.dataSource.transaction(async (manager) => {
      const oldData = { title: wi.title, priority: wi.priority, assigneeId: wi.assigneeId };
      Object.assign(wi, {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : wi.startDate,
        deadline: dto.deadline ? new Date(dto.deadline) : wi.deadline,
      });
      const updated = await manager.save(WorkItem, wi);

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: wi.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { title: updated.title, priority: updated.priority, assigneeId: updated.assigneeId },
        actorId: actor.id,
      });

      return updated;
    });
  }

  /**
   * BP014 - Phân công Assignee & Reviewer
   * Actor: PM, Team Lead
   * BR03: reviewer != assignee
   * BR05: Lock khi In-Review
   */
  async assign(
    id: string,
    dto: AssignMembersDto,
    actor: { id: string; role: string },
  ): Promise<WorkItem> {
    const wi = await this.findOneOrFail(id);
    this.assertNotLocked(wi);
    this.assertRoleIsManagerLevel(actor.role);

    if (dto.reviewerId && dto.assigneeId === dto.reviewerId) {
      throw new ConflictException('Reviewer không được trùng Assignee (BR03)');
    }

    await this.assertMemberOfProject(wi.projectId, dto.assigneeId, 'Assignee');
    if (dto.reviewerId) await this.assertMemberOfProject(wi.projectId, dto.reviewerId, 'Reviewer');

    return this.dataSource.transaction(async (manager) => {
      const oldData = { assigneeId: wi.assigneeId, reviewerId: wi.reviewerId };
      wi.assigneeId = dto.assigneeId;
      if (dto.reviewerId) wi.reviewerId = dto.reviewerId;
      const updated = await manager.save(WorkItem, wi);

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: wi.id,
        action: AuditAction.ASSIGN,
        oldData,
        newData: { assigneeId: updated.assigneeId, reviewerId: updated.reviewerId },
        actorId: actor.id,
      });

      return updated;
    });
  }

  /**
   * BP015 - Thiết lập thời hạn
   * Actor: PM, Team Lead
   * BR02: start <= deadline <= milestone.dueDate <= project.endDate
   */
  async setDeadline(
    id: string,
    dto: SetDeadlineDto,
    actor: { id: string; role: string },
  ): Promise<WorkItem> {
    const wi = await this.findOneOrFail(id);
    this.assertNotLocked(wi);
    this.assertRoleIsManagerLevel(actor.role);

    const start = new Date(dto.startDate);
    const deadline = new Date(dto.deadline);

    if (deadline < start) {
      throw new UnprocessableEntityException('Deadline phải >= Start Date (BR02)');
    }

    // Check milestone
    if (wi.milestoneId) {
      const ms = await this.milestoneRepo.findOne({ where: { id: wi.milestoneId } });
      if (ms && deadline > ms.dueDate) {
        throw new UnprocessableEntityException(
          `Deadline vượt quá Due Date Milestone (BR02): ${ms.dueDate.toISOString().slice(0, 10)}`,
        );
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const oldData = { startDate: wi.startDate, deadline: wi.deadline };
      wi.startDate = start;
      wi.deadline = deadline;
      const updated = await manager.save(WorkItem, wi);

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: wi.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { startDate: start, deadline },
        actorId: actor.id,
      });

      return updated;
    });
  }

  /**
   * BP016 - Thiết lập mức ưu tiên
   * Actor: PM, Team Lead
   * Urgent/High → set SLA fast-track flag
   */
  async setPriority(
    id: string,
    dto: SetPriorityDto,
    actor: { id: string; role: string },
  ): Promise<WorkItem> {
    const wi = await this.findOneOrFail(id);
    this.assertNotLocked(wi);
    this.assertRoleIsManagerLevel(actor.role);

    return this.dataSource.transaction(async (manager) => {
      const oldData = { priority: wi.priority };
      wi.priority = dto.priority;
      wi.priorityNote = dto.reason;

      if (dto.newEndDate) {
        wi.deadline = new Date(dto.newEndDate);
      }

      const updated = await manager.save(WorkItem, wi);

      // TODO(BUSINESS): Cascade priority sang Subtask cùng team (BP016)
      // chưa có quy định rõ, cắm TODO theo AI_CODING_RULES Điều 3
      if (dto.applyToSubtasks) {
        // TODO(BUSINESS): Implement cascade priority to subtasks after BA confirmation.
        // See docs/ai/OPEN_QUESTIONS.md
      }

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: wi.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { priority: dto.priority, priorityNote: dto.reason },
        actorId: actor.id,
      });

      return updated;
    });
  }

  /**
   * BP018 - Cập nhật tiến độ
   * Actor: Member (Assignee)
   * BR04: chỉ 0-90%, không được tự set 100%
   */
  async updateProgress(
    id: string,
    dto: UpdateProgressDto,
    actor: { id: string },
  ): Promise<WorkItem> {
    const wi = await this.findOneOrFail(id);

    // Chỉ Assignee được cập nhật tiến độ
    if (wi.assigneeId !== actor.id) {
      throw new ForbiddenException('Chỉ người được giao thực hiện mới có thể cập nhật tiến độ');
    }

    if (wi.status !== WorkItemStatus.IN_PROGRESS) {
      throw new UnprocessableEntityException('Chỉ cập nhật tiến độ khi Work Item ở trạng thái In-Progress');
    }

    // BR04: hard cap 90%
    if (dto.progressPercentage > 90) {
      throw new UnprocessableEntityException(
        'Người thực hiện chỉ được cập nhật tiến độ tối đa 90% (BR04). 100% được set tự động khi Reviewer Approve.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const oldData = { progressPercentage: wi.progressPercentage };
      wi.progressPercentage = dto.progressPercentage;
      const updated = await manager.save(WorkItem, wi);

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: wi.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { progressPercentage: dto.progressPercentage, note: dto.note },
        actorId: actor.id,
      });

      return updated;
    });
  }

  /**
   * BP019 - Chuyển trạng thái công việc
   * Actor: Member (In-Progress→In-Review), Reviewer (In-Review→Approved-Done/Reject)
   * State machine theo docs/states/06_STATE_MACHINES.md
   */
  async changeStatus(
    id: string,
    dto: ChangeStatusDto,
    actor: { id: string; role: string },
  ): Promise<WorkItem> {
    const wi = await this.findOneOrFail(id);

    // BR05: Không chuyển trạng thái khi đã Done/Cancel
    if (
      wi.status === WorkItemStatus.APPROVED_DONE ||
      wi.status === WorkItemStatus.CANCEL
    ) {
      throw new UnprocessableEntityException(
        `Work Item đã ở trạng thái ${wi.status}, không thể chuyển trạng thái (BR05)`,
      );
    }

    this.validateStatusTransition(wi, dto, actor);

    return this.dataSource.transaction(async (manager) => {
      const oldStatus = wi.status;
      wi.status = dto.status;

      // Approved-Done: tự động set 100% (BR04)
      if (dto.status === WorkItemStatus.APPROVED_DONE) {
        wi.progressPercentage = 100;
      }

      // Reject: quay lại In-Progress
      if (dto.status === WorkItemStatus.REJECT) {
        if (!dto.rejectReason) {
          throw new BadRequestException('Bắt buộc nhập lý do từ chối (BP019 E04)');
        }
        wi.status = WorkItemStatus.IN_PROGRESS;
        wi.progressPercentage = wi.progressPercentage;
      }

      // Q001: Pending -> chỉ về In-Progress (OPEN)
      // TODO(BUSINESS): Q001 - Pending có được về To Do không? Tạm thời chỉ cho về In-Progress.
      // See docs/ai/OPEN_QUESTIONS.md#Q001

      const updated = await manager.save(WorkItem, wi);

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: wi.id,
        action: AuditAction.STATUS_CHANGE,
        oldData: { status: oldStatus, progressPercentage: wi.progressPercentage },
        newData: {
          status: updated.status,
          progressPercentage: updated.progressPercentage,
          rejectReason: dto.rejectReason,
        },
        actorId: actor.id,
      });

      return updated;
    });
  }

  /**
   * BP027 - Xóa mềm Work Item
   * Actor: PM, Team Lead
   * BR06: Soft Delete + lý do >= 10 ký tự
   * BR05: Chặn khi In-Review/Done/KPI Confirmed
   */
  async softDelete(
    id: string,
    dto: DeleteWorkItemDto,
    actor: { id: string; role: string },
  ): Promise<void> {
    const wi = await this.findOneOrFail(id);
    this.assertRoleIsManagerLevel(actor.role);

    // BR05: Chặn xóa khi In-Review hoặc Done
    if (
      wi.status === WorkItemStatus.IN_REVIEW ||
      wi.status === WorkItemStatus.APPROVED_DONE
    ) {
      throw new UnprocessableEntityException(
        `Không thể xóa Work Item ở trạng thái ${wi.status} (BR05/BR06)`,
      );
    }

    // BR06: lý do >= 10 ký tự (đã validate tại DTO, double check)
    if (dto.deletionReason.length < 10) {
      throw new UnprocessableEntityException('Lý do xóa phải có ít nhất 10 ký tự (BR06)');
    }

    await this.dataSource.transaction(async (manager) => {
      wi.isDeleted = true;
      wi.deletedAt = new Date();
      wi.deletedBy = actor.id;
      wi.deletionReason = dto.deletionReason;
      await manager.save(WorkItem, wi);

      await this.auditLogService.log(manager, {
        entityName: 'WorkItem',
        entityId: wi.id,
        action: AuditAction.SOFT_DELETE,
        oldData: { status: wi.status, title: wi.title },
        newData: { isDeleted: true, deletionReason: dto.deletionReason, deletedBy: actor.id },
        actorId: actor.id,
      });
    });
  }

  async findOne(id: string): Promise<WorkItem> {
    return this.findOneOrFail(id);
  }

  async findByProject(projectId: string): Promise<WorkItem[]> {
    return this.workItemRepo.find({
      where: { projectId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private async findOneOrFail(id: string): Promise<WorkItem> {
    const wi = await this.workItemRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!wi) throw new NotFoundException(`Work Item ID "${id}" không tồn tại`);
    return wi;
  }

  private async findProjectOrFail(id: string): Promise<Project> {
    const p = await this.projectRepo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Dự án ID "${id}" không tồn tại`);
    return p;
  }

  /** BR05: Lock thông tin gốc khi In-Review / Done / Cancel */
  private assertNotLocked(wi: WorkItem) {
    if (LOCKED_STATUSES.includes(wi.status)) {
      throw new UnprocessableEntityException(
        `Work Item đang ở trạng thái ${wi.status} — thông tin gốc bị khóa Read-Only (BR05)`,
      );
    }
  }

  private assertRoleIsManagerLevel(role: string) {
    const allowed = [UserRole.PM, UserRole.TEAM_LEAD, UserRole.C_LEVEL];
    if (!allowed.includes(role as UserRole)) {
      throw new ForbiddenException('Chỉ PM hoặc Team Lead mới có quyền thực hiện thao tác này');
    }
  }

  private async assertProjectMember(projectId: string, userId: string) {
    const member = await this.memberRepo.findOne({ where: { projectId, userId } });
    if (!member) throw new ForbiddenException('Bạn không phải thành viên của dự án này');
  }

  private async assertMemberOfProject(projectId: string, userId: string, role: string) {
    const member = await this.memberRepo.findOne({ where: { projectId, userId } });
    if (!member) {
      throw new UnprocessableEntityException(`${role} không phải thành viên của dự án này`);
    }
  }

  /** Validate state machine transitions (BP019 + 06_STATE_MACHINES.md) */
  private validateStatusTransition(
    wi: WorkItem,
    dto: ChangeStatusDto,
    actor: { id: string; role: string },
  ) {
    const from = wi.status;
    const to = dto.status;

    // To Do → In-Progress: Assignee
    if (from === WorkItemStatus.TODO && to === WorkItemStatus.IN_PROGRESS) {
      if (wi.assigneeId !== actor.id) throw new ForbiddenException('Chỉ Assignee mới được bắt đầu công việc');
      return;
    }

    // In-Progress → In-Review: Assignee nộp bài
    if (from === WorkItemStatus.IN_PROGRESS && to === WorkItemStatus.IN_REVIEW) {
      if (wi.assigneeId !== actor.id) throw new ForbiddenException('Chỉ Assignee mới được nộp bài');
      return;
    }

    // In-Review → Approved-Done | Reject: Reviewer
    if (from === WorkItemStatus.IN_REVIEW) {
      if (to === WorkItemStatus.APPROVED_DONE || to === WorkItemStatus.REJECT) {
        if (wi.reviewerId !== actor.id) throw new ForbiddenException('Chỉ Reviewer mới được duyệt/từ chối');
        return;
      }
    }

    // To Do / In-Progress → Pending | Cancel: Manager
    if (
      [WorkItemStatus.TODO, WorkItemStatus.IN_PROGRESS].includes(from) &&
      [WorkItemStatus.PENDING, WorkItemStatus.CANCEL].includes(to)
    ) {
      this.assertRoleIsManagerLevel(actor.role);
      return;
    }

    // Pending → In-Progress (Q001: OPEN — tạm thời chỉ cho phép về In-Progress)
    if (from === WorkItemStatus.PENDING && to === WorkItemStatus.IN_PROGRESS) {
      this.assertRoleIsManagerLevel(actor.role);
      return;
    }

    throw new UnprocessableEntityException(
      `Chuyển trạng thái từ ${from} sang ${to} không hợp lệ theo State Machine`,
    );
  }
}
