import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-string', description: '登录或刷新后得到的 refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
