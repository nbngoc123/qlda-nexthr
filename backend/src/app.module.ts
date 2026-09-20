import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

// Entities
import { User } from './database/entities/user.entity';
import { Project } from './database/entities/project.entity';
import { ProjectMember } from './database/entities/project-member.entity';
import { Epic } from './database/entities/epic.entity';
import { Milestone } from './database/entities/milestone.entity';
import { WorkItem } from './database/entities/work-item.entity';
import { AuditLog } from './database/entities/audit-log.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { EpicsModule } from './modules/epics/epics.module';
import { WorkItemsModule } from './modules/work-items/work-items.module';
import { ProgressModule } from './modules/progress/progress.module';
import { AuditLogModule } from './audit-log/audit-log.module';

// Skeleton modules (UNANALYZED)
import { KpiController } from './modules/kpi/kpi.controller';
import { ViolationsController } from './modules/violations/violations.controller';
import { ReportsController } from './modules/reports/reports.controller';

@Module({
  imports: [
    // Config — đọc .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM — PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'nexthr'),
        password: config.get('DB_PASSWORD', 'nexthr_secret'),
        database: config.get('DB_NAME', 'nexthr_db'),
        entities: [User, Project, ProjectMember, Epic, Milestone, WorkItem, AuditLog],
        synchronize: config.get('NODE_ENV') !== 'production', // Auto-migrate chỉ ở dev
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Redis Cache
    CacheModule.register({
      isGlobal: true,
      ttl: 30, // 30 giây mặc định cho Kanban board
    }),

    // Feature modules
    AuditLogModule,
    AuthModule,
    ProjectsModule,
    EpicsModule,
    WorkItemsModule,
    ProgressModule,
  ],
  controllers: [
    // Skeleton controllers (UNANALYZED modules)
    KpiController,
    ViolationsController,
    ReportsController,
  ],
})
export class AppModule {}
