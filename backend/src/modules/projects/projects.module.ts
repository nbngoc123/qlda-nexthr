import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '../../database/entities/project.entity';
import { ProjectMember } from '../../database/entities/project-member.entity';
import { User } from '../../database/entities/user.entity';
import { AuditLogModule } from '../../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMember, User]),
    AuditLogModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
