import type { UserRole, UserStatus } from '../types/auth'
import { request } from './http'

interface ApiResponse<T> {
    code: number
    message?: string
    data: T
}

interface AdminUserResponse {
    id: string
    email: string
    nickname: string | null
    role: UserRole
    status: UserStatus
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    _count: {
        tasks: number
        categories: number
    }
}

interface AdminCategoryResponse {
    id: string
    name: string
    color: string
    userId: string
    createdAt: string
    updatedAt: string
    user: {
        id: string
        email: string
        nickname: string | null
    }
    _count: {
        tasks: number
    }
}

export interface AdminUser {
    id: string
    email: string
    nickname: string | null
    role: UserRole
    status: UserStatus
    avatarUrl: string | null
    createdAt: Date
    updatedAt: Date
    taskCount: number
    categoryCount: number
}

export interface AdminCategory {
    id: string
    name: string
    color: string
    userId: string
    createdAt: Date
    updatedAt: Date
    user: {
        id: string
        email: string
        nickname: string | null
    }
    taskCount: number
}

export interface CreateAdminCategoryPayload {
    userId: string
    name: string
    color?: string
}

export interface UpdateAdminCategoryPayload {
    userId?: string
    name?: string
    color?: string
}

const normalizeAdminUser = (user: AdminUserResponse): AdminUser => ({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
    taskCount: user._count.tasks,
    categoryCount: user._count.categories,
})

const normalizeAdminCategory = (category: AdminCategoryResponse): AdminCategory => ({
    id: category.id,
    name: category.name,
    color: category.color,
    userId: category.userId,
    createdAt: new Date(category.createdAt),
    updatedAt: new Date(category.updatedAt),
    user: category.user,
    taskCount: category._count.tasks,
})

export const adminApi = {
    async getUsers() {
        const response = await request<ApiResponse<AdminUserResponse[]>>('/admin/users')
        return response.data.map(normalizeAdminUser)
    },

    async getUser(id: string) {
        const response = await request<ApiResponse<AdminUserResponse>>(`/admin/users/${id}`)
        return normalizeAdminUser(response.data)
    },

    async updateUserStatus(id: string, status: UserStatus) {
        const response = await request<ApiResponse<AdminUserResponse>>(`/admin/users/${id}/status`, {
            method: 'PATCH',
            body: { status },
        })
        return normalizeAdminUser(response.data)
    },

    async getCategories() {
        const response = await request<ApiResponse<AdminCategoryResponse[]>>('/admin/categories')
        return response.data.map(normalizeAdminCategory)
    },

    async createCategory(payload: CreateAdminCategoryPayload) {
        const response = await request<ApiResponse<AdminCategoryResponse>>('/admin/categories', {
            method: 'POST',
            body: payload,
        })
        return normalizeAdminCategory(response.data)
    },

    async updateCategory(id: string, payload: UpdateAdminCategoryPayload) {
        const response = await request<ApiResponse<AdminCategoryResponse>>(`/admin/categories/${id}`, {
            method: 'PATCH',
            body: payload,
        })
        return normalizeAdminCategory(response.data)
    },

    async deleteCategory(id: string) {
        await request<{ code: number; message: string; length: number }>(`/admin/categories/${id}`, {
            method: 'DELETE',
        })
    },
}
