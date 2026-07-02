import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import type { TaskStatus } from '../../types/task';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ enum: ['todo', 'doing', 'done'], example: 'doing', description: '任务状态' })
  @IsOptional()
  @IsIn(['todo', 'doing', 'done'], {
    message: '任务状态必须是 todo、doing、done 之一',
  })
  status?: TaskStatus;
}
