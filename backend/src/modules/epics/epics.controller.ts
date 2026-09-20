import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseUUIDPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EpicsService } from './epics.service';
import { CreateEpicDto, UpdateEpicDto } from './dto/epic.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Epics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) {}

  /** BP010 - Tạo Epic trong project */
  @Post('projects/:projectId/epics')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP010 - Tạo Epic mới' })
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateEpicDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.epicsService.create(projectId, dto, user);
  }

  /** BP010 - Xem danh sách Epic */
  @Get('projects/:projectId/epics')
  @ApiOperation({ summary: 'BP010 - Xem danh sách Epic của dự án' })
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.epicsService.findByProject(projectId);
  }

  /** BP010 - Cập nhật Epic */
  @Patch('epics/:id')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP010 - Cập nhật Epic' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEpicDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.epicsService.update(id, dto, user);
  }

  /** BP010 - Xóa Epic */
  @Delete('epics/:id')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'BP010 - Xóa Epic' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.epicsService.remove(id, user);
  }
}
