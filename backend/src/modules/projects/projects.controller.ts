import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  SetObjectivesDto,
  SetTimelineDto,
  AddMembersDto,
} from './dto/project.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../database/entities/user.entity';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * BP001 - Tạo dự án mới
   * Actor: PM (R02) hoặc C-Level (R01)
   */
  @Post()
  @Roles(UserRole.PM, UserRole.C_LEVEL)
  @ApiOperation({ summary: 'BP001 - Tạo dự án mới' })
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.projectsService.create(dto, user.id);
  }

  /**
   * BP028 (read) - Xem danh sách dự án
   */
  @Get()
  @ApiOperation({ summary: 'Xem danh sách dự án theo quyền truy cập' })
  findAll(@CurrentUser() user: { id: string; role: string }) {
    return this.projectsService.findAll(user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết dự án' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  /**
   * BP002 - Cập nhật thông tin dự án (PARTIAL)
   * Actor: PM
   */
  @Patch(':id')
  @Roles(UserRole.PM)
  @ApiOperation({ summary: 'BP002 - Cập nhật thông tin dự án (PARTIAL)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.projectsService.update(id, dto, user.id);
  }

  /**
   * BP003 - Đặt mục tiêu dự án (PARTIAL)
   * Actor: PM
   */
  @Put(':id/objectives')
  @Roles(UserRole.PM)
  @ApiOperation({ summary: 'BP003 - Đặt mục tiêu dự án (PARTIAL)' })
  setObjectives(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetObjectivesDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.projectsService.setObjectives(id, dto, user.id);
  }

  /**
   * BP004 - Thiết lập khung thời gian
   * Actor: PM
   */
  @Patch(':id/timeline')
  @Roles(UserRole.PM)
  @ApiOperation({ summary: 'BP004 - Thiết lập khung thời gian dự án' })
  setTimeline(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetTimelineDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.projectsService.setTimeline(id, dto, user.id);
  }

  /**
   * BP005 - Thêm thành viên vào dự án
   * Actor: PM
   */
  @Post(':id/members')
  @Roles(UserRole.PM)
  @ApiOperation({ summary: 'BP005 - Thêm thành viên vào dự án' })
  addMembers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddMembersDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.projectsService.addMembers(id, dto, user.id);
  }

  /**
   * BP005 - Xóa thành viên khỏi dự án
   * Actor: PM
   */
  @Delete(':id/members/:userId')
  @Roles(UserRole.PM)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'BP005 - Xóa thành viên khỏi dự án' })
  removeMember(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.projectsService.removeMember(id, userId, user.id);
  }
}
