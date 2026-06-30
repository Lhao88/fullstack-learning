import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import type { TaskStatus } from '../../types/task';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsIn(['todo', 'doing', 'done'], {
    message: '任务状态必须是 todo、doing、done 之一',
  })
  status?: TaskStatus;
}
