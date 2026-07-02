export type UserRole = 'user' | 'super_admin'
export type UserStatus = 'enabled' | 'disabled'

export interface AuthUser {
    id: string
    email: string
    nickname: string | null
    role: UserRole
    status: UserStatus
    avatarUrl: string | null
    createdAt: Date
    updatedAt: Date
}
