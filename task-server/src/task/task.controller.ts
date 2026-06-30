import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.taskService.create(createTaskDto, user.id);
    return {
      code:200,
      data:result
    }
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.taskService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.taskService.findOne(id, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.taskService.update(id, updateTaskDto, user.id);
    return{
      code:200,
      message:'更新成功',
      data:result
    }
  }

  @Patch(':id/status/next')
  async changeToNextStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.taskService.changeToNextStatus(id, user.id);
    return {
      code:200,
      message:'状态更新成功',
      data:result
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const result = await this.taskService.remove(id, user.id);
    return {
      code:200,
      message:'删除成功',
      length:result
    }
  }
}
