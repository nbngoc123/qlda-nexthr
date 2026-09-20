import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseUUIDPipe, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkItemsService } from './work-items.service';
import {
  CreateWorkItemDto, UpdateWorkItemDto, AssignMembersDto,
  SetDeadlineDto, SetPriorityDto, UpdateProgressDto,
  ChangeStatusDto, DeleteWorkItemDto,
} from './dto/work-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Work Items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class WorkItemsController {
  constructor(private readonly workItemsService: WorkItemsService) {}

  /** BP011 - Tạo Work Item */
  @Post('projects/:projectId/work-items')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP011 - Tạo Work Item mới' })
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateWorkItemDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.workItemsService.create(projectId, dto, user);
  }

  /** BP028 (read) - Xem danh sách Work Item của project */
  @Get('projects/:projectId/work-items')
  @ApiOperation({ summary: 'Xem danh sách Work Item theo project' })
  findByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.workItemsService.findByProject(projectId);
  }

  @Get('work-items/:id')
  @ApiOperation({ summary: 'Xem chi tiết Work Item' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.workItemsService.findOne(id);
  }

  /** BP013 - Cập nhật thông tin gốc */
  @Patch('work-items/:id')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP013 - Cập nhật thông tin Work Item' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkItemDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.workItemsService.update(id, dto, user);
  }

  /** BP014 - Phân công Assignee & Reviewer */
  @Patch('work-items/:id/assign')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP014 - Phân công Assignee & Reviewer' })
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignMembersDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.workItemsService.assign(id, dto, user);
  }

  /** BP015 - Thiết lập thời hạn */
  @Patch('work-items/:id/deadline')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP015 - Thiết lập Start Date & Deadline' })
  setDeadline(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetDeadlineDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.workItemsService.setDeadline(id, dto, user);
  }

  /** BP016 - Thiết lập mức ưu tiên */
  @Patch('work-items/:id/priority')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP016 - Thiết lập Priority' })
  setPriority(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetPriorityDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.workItemsService.setPriority(id, dto, user);
  }

  /** BP018 - Cập nhật tiến độ (Member only, 0-90%) */
  @Patch('work-items/:id/progress')
  @Roles(UserRole.MEMBER, UserRole.PM, UserRole.TEAM_LEAD)
  @ApiOperation({ summary: 'BP018 - Cập nhật % tiến độ (0-90% cho Member)' })
  updateProgress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProgressDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.workItemsService.updateProgress(id, dto, user);
  }

  /** BP019 - Chuyển trạng thái */
  @Patch('work-items/:id/status')
  @ApiOperation({ summary: 'BP019 - Chuyển trạng thái công việc' })
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeStatusDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.workItemsService.changeStatus(id, dto, user);
  }

  /** BP027 - Xóa mềm Work Item */
  @Delete('work-items/:id')
  @Roles(UserRole.PM, UserRole.TEAM_LEAD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'BP027 - Xóa mềm Work Item (Soft Delete)' })
  softDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DeleteWorkItemDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.workItemsService.softDelete(id, dto, user);
  }
}
