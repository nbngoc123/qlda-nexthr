import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkItem, WorkItemStatus } from '../../database/entities/work-item.entity';
import { Project } from '../../database/entities/project.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';
import { BoardQueryDto } from './dto/board-query.dto';

/**
 * BP028 - Theo dõi Work Item (Kanban / List / Calendar)
 * Read-only, không tạo biến động dữ liệu
 * Kỹ thuật: filter is_deleted=false, Redis cache (TTL 30s), lazy-load >1000 tasks
 */
@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(WorkItem)
    private readonly workItemRepo: Repository<WorkItem>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
  ) {}

  async getBoard(
    projectId: string,
    query: BoardQueryDto,
    actor: { id: string; role: string },
  ) {
    // Validate project tồn tại
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`Dự án ID "${projectId}" không tồn tại`);

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const qb = this.workItemRepo
      .createQueryBuilder('wi')
      .leftJoinAndSelect('wi.assignee', 'assignee')
      .leftJoinAndSelect('wi.reviewer', 'reviewer')
      .leftJoinAndSelect('wi.epic', 'epic')
      .leftJoinAndSelect('wi.milestone', 'milestone')
      .where('wi.projectId = :projectId', { projectId })
      .andWhere('wi.isDeleted = false') // BR06: loại trừ bản ghi xóa mềm
      .orderBy('wi.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize);

    // Áp dụng bộ lọc (BP028)
    if (query.epicId) qb.andWhere('wi.epicId = :epicId', { epicId: query.epicId });
    if (query.milestoneId) qb.andWhere('wi.milestoneId = :milestoneId', { milestoneId: query.milestoneId });
    if (query.assigneeId) qb.andWhere('wi.assigneeId = :assigneeId', { assigneeId: query.assigneeId });
    if (query.status) qb.andWhere('wi.status = :status', { status: query.status });
    if (query.priority) qb.andWhere('wi.priority = :priority', { priority: query.priority });
    if (query.isOverdue) {
      qb.andWhere('wi.deadline < NOW()')
        .andWhere('wi.status NOT IN (:...done)', {
          done: [WorkItemStatus.APPROVED_DONE, WorkItemStatus.CANCEL],
        });
    }

    const [items, total] = await qb.getManyAndCount();

    // Kanban: nhóm theo status
    if (query.viewMode === 'kanban' || !query.viewMode) {
      const columns = this.groupByStatus(items);
      return { viewMode: 'kanban', projectId, total, page, pageSize, columns };
    }

    return { viewMode: query.viewMode ?? 'list', projectId, total, page, pageSize, items };
  }

  private groupByStatus(items: WorkItem[]) {
    const columns: Record<string, WorkItem[]> = {};
    for (const status of Object.values(WorkItemStatus)) {
      columns[status] = [];
    }
    for (const item of items) {
      columns[item.status].push(item);
    }
    return columns;
  }
}
