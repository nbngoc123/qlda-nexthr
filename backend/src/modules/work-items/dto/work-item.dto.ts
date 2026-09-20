import {
  IsString, IsOptional, IsEnum, IsUUID, IsDateString,
  IsNumber, Min, Max, IsInt, IsBoolean, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  WorkItemType,
  WorkItemPriority,
  WorkItemStatus,
} from '../../../database/entities/work-item.entity';

/** BP011 - Tạo Work Item */
export class CreateWorkItemDto {
  @ApiProperty()
  @IsUUID()
  epicId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  milestoneId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentId?: string; // Subtask

  @ApiProperty({ example: 'Xây dựng API quản lý dự án' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @ApiProperty({ enum: WorkItemType })
  @IsEnum(WorkItemType)
  type: WorkItemType;

  @ApiPropertyOptional({ enum: WorkItemPriority, default: WorkItemPriority.MEDIUM })
  @IsOptional()
  @IsEnum(WorkItemPriority)
  priority?: WorkItemPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  /** BR03: reviewerId != assigneeId — validated at service */
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reviewerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /** BR02: deadline <= milestone.dueDate */
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;
}

/** BP013 - Cập nhật Work Item */
export class UpdateWorkItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @ApiPropertyOptional({ enum: WorkItemPriority })
  @IsOptional()
  @IsEnum(WorkItemPriority)
  priority?: WorkItemPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reviewerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;
}

/** BP014 - Phân công nhân sự */
export class AssignMembersDto {
  @ApiProperty()
  @IsUUID()
  assigneeId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  reviewerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignNote?: string;
}

/** BP015 - Thiết lập thời hạn */
export class SetDeadlineDto {
  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  deadline: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timelineNote?: string;
}

/** BP016 - Thiết lập mức ưu tiên */
export class SetPriorityDto {
  @ApiProperty({ enum: WorkItemPriority })
  @IsEnum(WorkItemPriority)
  priority: WorkItemPriority;

  @ApiProperty({ example: 'Khách hàng yêu cầu gấp' })
  @IsString()
  @MinLength(5)
  reason: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  newEndDate?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  applyToSubtasks?: boolean;
}

/** BP018 - Cập nhật tiến độ */
export class UpdateProgressDto {
  /**
   * BR04: Member chỉ được cập nhật 0-90%
   * 100% chỉ được set tự động khi Approve
   */
  @ApiProperty({ minimum: 0, maximum: 90 })
  @IsInt()
  @Min(0)
  @Max(90)
  progressPercentage: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

/** BP019 - Chuyển trạng thái */
export class ChangeStatusDto {
  @ApiProperty({ enum: WorkItemStatus })
  @IsEnum(WorkItemStatus)
  status: WorkItemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  /** Bắt buộc khi Reject (BP019 E04) */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectReason?: string;
}

/** BP027 - Xóa mềm Work Item */
export class DeleteWorkItemDto {
  /** BR06: lý do xóa >= 10 ký tự */
  @ApiProperty({ example: 'Công việc không còn phù hợp với phạm vi dự án' })
  @IsString()
  @MinLength(10)
  deletionReason: string;
}
