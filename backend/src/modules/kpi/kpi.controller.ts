import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * M04 - KPI Management (BP037 - BP045)
 * Trạng thái: UNANALYZED
 * AI_CODING_RULES Điều 2: Tuyệt đối cấm tự viết logic xử lý.
 * Chỉ tạo skeleton và throw NotImplementedException.
 */
@ApiTags('KPI (Skeleton - UNANALYZED)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('kpi')
export class KpiController {
  @Get()
  @ApiOperation({ summary: 'BP037-045 - UNANALYZED - Skeleton only' })
  getKpi() {
    // TODO(BUSINESS): Need business decision from BA/PO before implementation.
    // See docs/ai/TODO_BUSINESS.md BP037-BP045
    throw new Error('Business logic is under analysis');
  }

  @Post('calculate')
  @ApiOperation({ summary: 'BP041 - Tính toán KPI - UNANALYZED' })
  calculate() {
    // TODO(BUSINESS): Need business decision from BA/PO before implementation.
    // See docs/ai/TODO_BUSINESS.md#BP041
    throw new Error('Business logic is under analysis');
  }
}
