import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    const result = this.taskService.create(createTaskDto);
    return {
      code:200,
      data:result
    }
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const result = this.taskService.update(id, updateTaskDto);
    return{
      code:200,
      message:'更新成功',
      data:result
    }
  }

  @Patch(':id/status/next')
  changeToNextStatus(@Param('id') id: string) {
    const result = this.taskService.changeToNextStatus(id);
    return {
      code:200,
      message:'状态更新成功',
      data:result
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const result = this.taskService.remove(id);
    return {
      code:200,
      message:'删除成功',
      length:result
    }
  }
}
