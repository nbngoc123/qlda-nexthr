import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * M05 - Violation & Quality (BP046 - BP051)
 * Trạng thái: UNANALYZED
 * AI_CODING_RULES Điều 2: Chỉ tạo skeleton.
 */
@ApiTags('Violations (Skeleton - UNANALYZED)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('violations')
export class ViolationsController {
  @Get()
  @ApiOperation({ summary: 'BP046-051 - UNANALYZED - Skeleton only' })
  getViolations() {
    // TODO(BUSINESS): Need business decision from BA/PO before implementation.
    // See docs/ai/TODO_BUSINESS.md BP046-BP051
    // Q002: violation_type_enum chưa xác định, dùng String tự do tạm thời
    throw new Error('Business logic is under analysis');
  }

  @Post()
  @ApiOperation({ summary: 'BP046 - Ghi nhận vi phạm - UNANALYZED' })
  createViolation() {
    // TODO(BUSINESS): Need business decision from BA/PO before implementation.
    throw new Error('Business logic is under analysis');
  }
}
