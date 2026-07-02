import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'user@example.com', description: '注册邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ example: '123456', minLength: 6, description: '注册密码' })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少需要 6 个字符' })
  password: string;

  @ApiPropertyOptional({ example: '小豪', description: '用户昵称' })
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  nickname?: string;
}
