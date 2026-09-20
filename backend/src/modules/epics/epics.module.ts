import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpicsService } from './epics.service';
import { EpicsController } from './epics.controller';
import { Epic } from '../../database/entities/epic.entity';
import { Project } from '../../database/entities/project.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';
import { AuditLogModule } from '../../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Epic, Project, ProjectMember]),
    AuditLogModule,
  ],
  providers: [EpicsService],
  controllers: [EpicsController],
  exports: [EpicsService],
})
export class EpicsModule {}
