import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: '分类名称必须是字符串' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @MaxLength(20, { message: '分类名称不能超过 20 个字符' })
  name: string;

  @IsOptional()
  @IsString({ message: '分类颜色必须是字符串' })
  @MaxLength(20, { message: '分类颜色不能超过 20 个字符' })
  color?: string;
}
