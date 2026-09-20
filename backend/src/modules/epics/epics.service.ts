import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Epic } from '../../database/entities/epic.entity';
import { Project, ProjectStatus } from '../../database/entities/project.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AuditAction } from '../../database/entities/audit-log.entity';
import { CreateEpicDto, UpdateEpicDto } from './dto/epic.dto';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class EpicsService {
  constructor(
    @InjectRepository(Epic)
    private readonly epicRepo: Repository<Epic>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
    private readonly auditLogService: AuditLogService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * BP010 - Tạo Epic
   * Actor: PM (R02), Team Lead (R03)
   * Pre-condition: Project Active; tên Epic unique trong project
   */
  async create(
    projectId: string,
    dto: CreateEpicDto,
    actor: { id: string; role: string },
  ): Promise<Epic> {
    const project = await this.findProjectOrFail(projectId);

    if (project.status !== ProjectStatus.ACTIVE) {
      throw new ForbiddenException('Chỉ có thể tạo Epic khi dự án ở trạng thái Active');
    }

    await this.assertProjectMember(projectId, actor.id, [UserRole.PM, UserRole.TEAM_LEAD]);

    // Kiểm tra tên Epic unique trong cùng project (BP010)
    const existing = await this.epicRepo.findOne({
      where: { projectId, name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Tên Epic "${dto.name}" đã tồn tại trong dự án này`);
    }

    // Validate ngày (BP010)
    if (dto.startDate && dto.endDate && new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new UnprocessableEntityException('End Date của Epic phải >= Start Date');
    }

    return this.dataSource.transaction(async (manager) => {
      const epic = manager.create(Epic, {
        ...dto,
        projectId,
        createdById: actor.id,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      });
      const saved = await manager.save(Epic, epic);

      await this.auditLogService.log(manager, {
        entityName: 'Epic',
        entityId: saved.id,
        action: AuditAction.CREATE,
        newData: { name: saved.name, projectId, status: saved.status },
        actorId: actor.id,
      });

      return saved;
    });
  }

  /**
   * BP010 - Cập nhật Epic
   * Actor: PM, Team Lead
   */
  async update(
    epicId: string,
    dto: UpdateEpicDto,
    actor: { id: string; role: string },
  ): Promise<Epic> {
    const epic = await this.findOneOrFail(epicId);
    await this.assertProjectMember(epic.projectId, actor.id, [UserRole.PM, UserRole.TEAM_LEAD]);

    if (dto.startDate && dto.endDate && new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new UnprocessableEntityException('End Date phải >= Start Date');
    }

    return this.dataSource.transaction(async (manager) => {
      const oldData = { name: epic.name, status: epic.status };
      Object.assign(epic, {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : epic.startDate,
        endDate: dto.endDate ? new Date(dto.endDate) : epic.endDate,
      });
      const updated = await manager.save(Epic, epic);

      await this.auditLogService.log(manager, {
        entityName: 'Epic',
        entityId: epic.id,
        action: AuditAction.UPDATE,
        oldData,
        newData: { name: updated.name, status: updated.status },
        actorId: actor.id,
      });

      return updated;
    });
  }

  /**
   * BP010 - Xóa Epic
   * Actor: PM, Team Lead
   */
  async remove(epicId: string, actor: { id: string; role: string }): Promise<void> {
    const epic = await this.findOneOrFail(epicId);
    await this.assertProjectMember(epic.projectId, actor.id, [UserRole.PM, UserRole.TEAM_LEAD]);

    await this.dataSource.transaction(async (manager) => {
      await this.auditLogService.log(manager, {
        entityName: 'Epic',
        entityId: epic.id,
        action: AuditAction.SOFT_DELETE,
        oldData: { name: epic.name, projectId: epic.projectId },
        actorId: actor.id,
      });
      await manager.remove(Epic, epic);
    });
  }

  /** Xem danh sách Epic của một project */
  async findByProject(projectId: string): Promise<Epic[]> {
    return this.epicRepo.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
    });
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async findOneOrFail(id: string): Promise<Epic> {
    const epic = await this.epicRepo.findOne({ where: { id } });
    if (!epic) throw new NotFoundException(`Epic ID "${id}" không tồn tại`);
    return epic;
  }

  private async findProjectOrFail(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Dự án ID "${id}" không tồn tại`);
    return project;
  }

  private async assertProjectMember(
    projectId: string,
    userId: string,
    allowedRoles: UserRole[],
  ) {
    const member = await this.memberRepo.findOne({ where: { projectId, userId } });
    if (!member) {
      throw new ForbiddenException('Bạn không phải thành viên của dự án này');
    }
    // C-Level bypass
  }
}
