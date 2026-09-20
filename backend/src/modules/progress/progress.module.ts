import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { WorkItem } from '../../database/entities/work-item.entity';
import { Project } from '../../database/entities/project.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkItem, Project, ProjectMember])],
  providers: [ProgressService],
  controllers: [ProgressController],
})
export class ProgressModule {}
