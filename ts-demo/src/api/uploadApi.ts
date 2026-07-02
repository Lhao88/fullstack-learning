import { request } from './http'
import type { AuthUser, UserRole, UserStatus } from '../types/auth'

interface UserResponse {
    id: string
    email: string
    nickname: string | null
    role: UserRole
    status: UserStatus
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
}

interface ApiResponse<T> {
    code: number
    message?: string
    data: T
}

const normalizeUser = (user: UserResponse): AuthUser => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
})

export const uploadApi = {
    async uploadAvatar(file: File) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await request<ApiResponse<UserResponse>>('/auth/avatar', {
            method: 'POST',
            body: formData,
        })

        return normalizeUser(response.data)
    },
}
