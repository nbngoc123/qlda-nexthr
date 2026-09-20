import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Project,
  ProjectStatus,
} from '../../database/entities/project.entity';
import {
  ProjectMember,
  ProjectMemberRole,
} from '../../database/entities/project-member.entity';

import { User } from '../../database/entities/user.entity';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AuditAction } from '../../database/entities/audit-log.entity';
import {
  CreateProjectDto,
  UpdateProjectDto,
  SetObjectivesDto,
  SetTimelineDto,
  AddMembersDto,
} from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly auditLogService: AuditLogService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * BP001 - Tạo dự án mới
   * Actor: PM (R02)
   * BR01: project_code unique; status = Planning; PM = người tạo
   * BR07: Audit Log trong cùng Transaction
   */
  async create(dto: CreateProjectDto, actorId: string): Promise<Project> {
    // Kiểm tra trùng project_code (BR01)
    const existing = await this.projectRepo.findOne({
      where: { projectCode: dto.projectCode },
    });
    if (existing) {
      throw new ConflictException(
        `Mã dự án "${dto.projectCode}" đã tồn tại trong hệ thống`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const project = manager.create(Project, {
        ...dto,
        status: ProjectStatus.PLANNING,
        pmId: actorId, // BR01: người tạo tự động là PM
      });
      const saved = await manager.save(Project, project);

      // BR07: Ghi Audit Log trong cùng Transaction
      await this.auditLogService.log(manager, {
        entityName: 'Project',
        entityId: saved.id,
        action: AuditAction.CREATE,
        newData: { projectCode: saved.projectCode, name: saved.name, status: saved.status },
        actorId,
      });

      // BP005 implicit: tự thêm PM vào project_members
      const member = manager.create(ProjectMember, {
        projectId: saved.id,
        userId: actorId,
        role: ProjectMemberRole.PM,
        joinedDate: new Date(),
      });
      await manager.save(ProjectMember, member);


      return saved;
    });
  }

  /**
   * BP002 - Cập nhật thông tin dự án (PARTIAL)
   * Actor: PM
   * BR07: Audit Log
   */
  async update(
    projectId: string,
    dto: UpdateProjectDto,
    actorId: string,
  ): Promise<Project> {
    const project = await this.findOneOrFail(projectId);

    // Chỉ PM phụ trách được sửa
    if (project.pmId !== actorId) {
      throw new ForbiddenException('Chỉ PM phụ trách dự án mới được cập nhật');
    }

    // TODO(BUSINESS): Quy định có cho phép sửa khi Project ở Completed/Closed không?
    // Hiện tại chặn khi Closed. See docs/ai/OPEN_QUESTIONS.md
    if (project.status === ProjectStatus.CLOSED) {
      throw new ForbiddenException('Không thể cập nhật dự án đã đóng');
    }

    return this.dataSource.transaction(async (manager) => {
      const oldData = { name: project.name, description: project.description, budget: project.budget };
      Object.assign(project, dto);
      const updated = await manager.save(Project, project);

      await this.auditLogService.log(manager, {
        entityName: 'Project',
        entityId: project.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { name: updated.name, description: updated.description, budget: updated.budget },
        actorId,
      });

      return updated;
    });
  }

  /**
   * BP003 - Đặt mục tiêu dự án (PARTIAL)
   * Actor: PM
   */
  async setObjectives(
    projectId: string,
    dto: SetObjectivesDto,
    actorId: string,
  ): Promise<Project> {
    const project = await this.findOneOrFail(projectId);
    await this.assertIsPM(project, actorId);
    this.assertNotClosed(project);

    return this.dataSource.transaction(async (manager) => {
      const oldData = { objectives: project.objectives };
      project.objectives = dto.objectives;
      const updated = await manager.save(Project, project);

      await this.auditLogService.log(manager, {
        entityName: 'Project',
        entityId: project.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { objectives: dto.objectives },
        actorId,
      });

      return updated;
    });
  }

  /**
   * BP004 - Thiết lập khung thời gian dự án
   * Actor: PM
   * BR01: end_date >= start_date
   * BR07: Audit Log
   */
  async setTimeline(
    projectId: string,
    dto: SetTimelineDto,
    actorId: string,
  ): Promise<Project> {
    const project = await this.findOneOrFail(projectId);
    await this.assertIsPM(project, actorId);
    this.assertNotClosed(project);

    // BR01: end_date >= start_date
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate < startDate) {
      throw new UnprocessableEntityException(
        'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu (BR01)',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const oldData = { startDate: project.startDate, endDate: project.endDate };
      project.startDate = startDate;
      project.endDate = endDate;
      if (dto.timelineNote) project.timelineNote = dto.timelineNote;
      const updated = await manager.save(Project, project);

      await this.auditLogService.log(manager, {
        entityName: 'Project',
        entityId: project.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { startDate, endDate, timelineNote: dto.timelineNote },
        actorId,
      });

      return updated;
    });
  }

  /**
   * BP005 - Thêm thành viên vào dự án
   * Actor: PM
   * BR07: Audit Log
   */
  async addMembers(
    projectId: string,
    dto: AddMembersDto,
    actorId: string,
  ): Promise<ProjectMember[]> {
    const project = await this.findOneOrFail(projectId);
    await this.assertIsPM(project, actorId);
    this.assertNotClosed(project);

    if (![ProjectStatus.PLANNING, ProjectStatus.ACTIVE].includes(project.status)) {
      throw new ForbiddenException('Chỉ có thể thêm thành viên khi dự án ở trạng thái Planning hoặc Active');
    }

    return this.dataSource.transaction(async (manager) => {
      const added: ProjectMember[] = [];

      for (const userId of dto.userIds) {
        // Kiểm tra user tồn tại và active
        const user = await this.userRepo.findOne({
          where: { id: userId, isActive: true },
        });
        if (!user) {
          throw new NotFoundException(`Nhân sự ID "${userId}" không tồn tại hoặc đã bị khóa`);
        }

        // Kiểm tra trùng thành viên
        const exists = await manager.findOne(ProjectMember, {
          where: { projectId, userId },
        });
        if (exists) continue; // Bỏ qua nếu đã là thành viên

        const member = manager.create(ProjectMember, {
          projectId,
          userId,
          joinedDate: dto.joinedDate ? new Date(dto.joinedDate) : new Date(),
        });
        const saved = await manager.save(ProjectMember, member);
        added.push(saved);

        await this.auditLogService.log(manager, {
          entityName: 'ProjectMember',
          entityId: saved.id,
          action: AuditAction.CREATE,
          newData: { projectId, userId, joinedDate: saved.joinedDate },
          actorId,
        });
      }

      return added;
    });
  }

  /** BP005 - Xóa thành viên khỏi dự án */
  async removeMember(
    projectId: string,
    userId: string,
    actorId: string,
  ): Promise<void> {
    const project = await this.findOneOrFail(projectId);
    await this.assertIsPM(project, actorId);

    if (userId === project.pmId) {
      throw new ForbiddenException('Không thể xóa PM khỏi dự án');
    }

    const member = await this.memberRepo.findOne({
      where: { projectId, userId },
    });
    if (!member) {
      throw new NotFoundException('Thành viên không tồn tại trong dự án');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.remove(ProjectMember, member);
      await this.auditLogService.log(manager, {
        entityName: 'ProjectMember',
        entityId: member.id,
        action: AuditAction.SOFT_DELETE,
        oldData: { projectId, userId },
        actorId,
      });
    });
  }

  async findAll(actorId: string, actorRole: string): Promise<Project[]> {
    // C-Level xem tất cả, PM/TL/Member chỉ xem project mình tham gia
    if (actorRole === 'C_LEVEL' || actorRole === 'ADMIN') {
      return this.projectRepo.find({ order: { createdAt: 'DESC' } });
    }

    const memberships = await this.memberRepo.find({ where: { userId: actorId } });
    const projectIds = memberships.map((m) => m.projectId);
    if (projectIds.length === 0) return [];

    return this.projectRepo
      .createQueryBuilder('p')
      .where('p.id IN (:...ids)', { ids: projectIds })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Project> {
    return this.findOneOrFail(id);
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async findOneOrFail(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Dự án ID "${id}" không tồn tại`);
    }
    return project;
  }

  private async assertIsPM(project: Project, actorId: string) {
    if (project.pmId !== actorId) {
      throw new ForbiddenException('Chỉ PM phụ trách dự án mới có quyền thực hiện thao tác này');
    }
  }

  private assertNotClosed(project: Project) {
    if (project.status === ProjectStatus.CLOSED) {
      throw new ForbiddenException('Dự án đã đóng, không thể thực hiện thao tác này');
    }
  }
}
