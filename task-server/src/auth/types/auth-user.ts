export interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
  createdAt: Date;
  updatedAt: Date;
}
