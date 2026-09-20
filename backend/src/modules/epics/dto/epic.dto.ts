import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EpicStatus } from '../../../database/entities/epic.entity';

/** BP010 - Tạo/Cập nhật Epic */
export class CreateEpicDto {
  @ApiProperty({ example: 'Epic: Quản lý công việc' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  target?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-06-30' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: EpicStatus, default: EpicStatus.OPEN })
  @IsOptional()
  @IsEnum(EpicStatus)
  status?: EpicStatus;
}

export class UpdateEpicDto extends CreateEpicDto {}
