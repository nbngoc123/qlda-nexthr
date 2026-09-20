import { Controller, Get, Param, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { BoardQueryDto } from './dto/board-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/board')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  /**
   * BP028 - Theo dõi Work Item (Kanban / List / Calendar)
   * Tất cả thành viên project đều có quyền xem (P028)
   */
  @Get()
  @ApiOperation({ summary: 'BP028 - Xem bảng Kanban / List / Calendar tiến độ' })
  getBoard(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: BoardQueryDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.progressService.getBoard(projectId, query, user);
  }
}
