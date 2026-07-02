import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import type { AuthUserStatus } from '../../auth/types/auth-user';

export class UpdateUserStatusDto {
  @ApiProperty({ enum: ['enabled', 'disabled'], example: 'disabled', description: '用户启用状态' })
  @IsIn(['enabled', 'disabled'], {
    message: '用户状态必须是 enabled、disabled 之一',
  })
  status: AuthUserStatus;
}
