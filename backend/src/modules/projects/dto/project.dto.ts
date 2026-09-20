import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ProjectStatus } from '../../../database/entities/project.entity';

/** BP001 - Tạo dự án */
export class CreateProjectDto {
  @ApiProperty({ example: 'PRJ_2026_01' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Z0-9_]+$/, { message: 'projectCode chỉ được chứa chữ in hoa, số và dấu gạch dưới' })
  projectCode: string;

  @ApiProperty({ example: 'Hệ thống quản lý nhân sự NextHR' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 500000000 })
  @IsOptional()
  @IsNumber()
  budget?: number;
}

/** BP002 - Cập nhật dự án (PARTIAL) */
export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  budget?: number;

  // TODO(BUSINESS): Quy định khóa sửa khi Project ở trạng thái Closed
  // chưa được làm rõ đầy đủ. See docs/ai/OPEN_QUESTIONS.md
}

/** BP003 - Đặt mục tiêu (PARTIAL) */
export class SetObjectivesDto {
  @ApiProperty({ example: 'Triển khai hệ thống quản lý công việc cho 100 nhân viên' })
  @IsString()
  @MinLength(10)
  objectives: string;

  // TODO(BUSINESS): Chỉ số đo lường mục tiêu (KPI metrics) chưa được định nghĩa rõ.
  // See docs/ai/OPEN_QUESTIONS.md
}

/** BP004 - Đặt thời gian */
export class SetTimelineDto {
  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-12-31' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timelineNote?: string;
}

/** BP005 - Thêm thành viên */
export class AddMembersDto {
  @ApiProperty({ type: [String], example: ['uuid-1', 'uuid-2'] })
  @IsString({ each: true })
  userIds: string[];

  @ApiPropertyOptional({ example: '2026-01-15' })
  @IsOptional()
  @IsDateString()
  joinedDate?: string;
}
