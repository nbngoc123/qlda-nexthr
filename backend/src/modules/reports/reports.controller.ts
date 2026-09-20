import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * M06 - Report & Dashboard (BP052 - BP060)
 * Trạng thái: UNANALYZED
 * AI_CODING_RULES Điều 2: Chỉ tạo skeleton.
 */
@ApiTags('Reports (Skeleton - UNANALYZED)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  @Get('today')
  @ApiOperation({ summary: 'BP052 - Dashboard Hôm nay - UNANALYZED' })
  getDashboardToday() {
    // TODO(BUSINESS): Need business decision from BA/PO before implementation.
    // See docs/ai/TODO_BUSINESS.md#BP052
    throw new Error('Business logic is under analysis');
  }

  @Get('project-summary')
  @ApiOperation({ summary: 'BP053 - Dashboard Tổng - UNANALYZED' })
  getProjectSummary() {
    // TODO(BUSINESS): Need business decision from BA/PO before implementation.
    throw new Error('Business logic is under analysis');
  }

  @Get('kpi')
  @ApiOperation({ summary: 'BP058 - Báo cáo KPI - UNANALYZED' })
  getKpiReport() {
    // TODO(BUSINESS): Need business decision from BA/PO before implementation.
    throw new Error('Business logic is under analysis');
  }
}
