import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItemsService } from './work-items.service';
import { WorkItemsController } from './work-items.controller';
import { WorkItem } from '../../database/entities/work-item.entity';
import { Project } from '../../database/entities/project.entity';
import { Epic } from '../../database/entities/epic.entity';
import { Milestone } from '../../database/entities/milestone.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';
import { AuditLogModule } from '../../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkItem, Project, Epic, Milestone, ProjectMember]),
    AuditLogModule,
  ],
  providers: [WorkItemsService],
  controllers: [WorkItemsController],
  exports: [WorkItemsService],
})
export class WorkItemsModule {}
