import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { TaskLevel } from '../../types/task';

export class CreateTaskDto {
  @IsString({ message: '任务标题必须是字符串' })
  @IsNotEmpty({ message: '任务标题不能为空' })
  title: string;

  @IsString({ message: '任务描述必须是字符串' })
  @IsNotEmpty({ message: '任务描述不能为空' })
  description: string;

  @IsIn(['high', 'medium', 'low'], {
    message: '任务优先级必须是 high、medium、low 之一',
  })
  level: TaskLevel;

  @IsOptional()
  @IsString({ message: '任务分类 ID 必须是字符串' })
  categoryId?: string | null;
}
