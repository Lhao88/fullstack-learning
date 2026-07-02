import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '学习', maxLength: 20, description: '分类名称，同一用户下不能重复' })
  @IsString({ message: '分类名称必须是字符串' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @MaxLength(20, { message: '分类名称不能超过 20 个字符' })
  name: string;

  @ApiPropertyOptional({ example: 'blue', maxLength: 20, description: '分类颜色标识' })
  @IsOptional()
  @IsString({ message: '分类颜色必须是字符串' })
  @MaxLength(20, { message: '分类颜色不能超过 20 个字符' })
  color?: string;
}
