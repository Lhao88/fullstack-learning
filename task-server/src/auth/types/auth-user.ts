export type AuthUserRole = 'user' | 'super_admin';
export type AuthUserStatus = 'enabled' | 'disabled';

export interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
  role: AuthUserRole;
  status: AuthUserStatus;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
