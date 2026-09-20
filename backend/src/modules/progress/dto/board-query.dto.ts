import { IsOptional, IsUUID, IsEnum, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkItemStatus, WorkItemPriority } from '../../../database/entities/work-item.entity';

/** BP028 - Query params cho Kanban board */
export class BoardQueryDto {
  @ApiPropertyOptional({ enum: ['kanban', 'list', 'calendar'], default: 'kanban' })
  @IsOptional()
  viewMode?: 'kanban' | 'list' | 'calendar';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  epicId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  milestoneId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional({ enum: WorkItemStatus })
  @IsOptional()
  @IsEnum(WorkItemStatus)
  status?: WorkItemStatus;

  @ApiPropertyOptional({ enum: WorkItemPriority })
  @IsOptional()
  @IsEnum(WorkItemPriority)
  priority?: WorkItemPriority;

  @ApiPropertyOptional({ description: 'Lọc công việc quá hạn' })
  @IsOptional()
  @IsBoolean()
  isOverdue?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number;
}
