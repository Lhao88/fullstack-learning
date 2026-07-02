import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { TaskLevel } from '../../types/task';

export class CreateTaskDto {
  @ApiProperty({ example: '完成接口联调', description: '任务标题' })
  @IsString({ message: '任务标题必须是字符串' })
  @IsNotEmpty({ message: '任务标题不能为空' })
  title: string;

  @ApiProperty({ example: '将前端任务列表改为调用后端接口', description: '任务描述' })
  @IsString({ message: '任务描述必须是字符串' })
  @IsNotEmpty({ message: '任务描述不能为空' })
  description: string;

  @ApiProperty({ enum: ['high', 'medium', 'low'], example: 'high', description: '任务优先级' })
  @IsIn(['high', 'medium', 'low'], {
    message: '任务优先级必须是 high、medium、low 之一',
  })
  level: TaskLevel;

  @ApiPropertyOptional({ example: 'category-id', nullable: true, description: '任务分类 ID' })
  @IsOptional()
  @IsString({ message: '任务分类 ID 必须是字符串' })
  categoryId?: string | null;
}
