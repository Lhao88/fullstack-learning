import type { CategoryItem } from '../types/category'
import { request } from './http'

interface ApiResponse<T> {
    code: number
    message?: string
    data: T
}

interface DeleteCategoryResponse {
    code: number
    message: string
    length: number
}

interface CategoryResponse {
    id: string
    name: string
    color: string
    createdAt: string
    updatedAt: string
    userId: string
    _count?: {
        tasks: number
    }
}

export interface CreateCategoryPayload {
    name: string
    color?: string
}

export interface UpdateCategoryPayload {
    name?: string
    color?: string
}

const normalizeCategory = (category: CategoryResponse): CategoryItem => ({
    id: category.id,
    name: category.name,
    color: category.color,
    createdAt: new Date(category.createdAt),
    updatedAt: new Date(category.updatedAt),
    userId: category.userId,
    taskCount: category._count?.tasks,
})

export const categoryApi = {
    async getCategories() {
        const response = await request<ApiResponse<CategoryResponse[]>>('/category')
        return response.data.map(normalizeCategory)
    },

    async createCategory(payload: CreateCategoryPayload) {
        const response = await request<ApiResponse<CategoryResponse>>('/category', {
            method: 'POST',
            body: payload,
        })
        return normalizeCategory(response.data)
    },

    async updateCategory(id: string, payload: UpdateCategoryPayload) {
        const response = await request<ApiResponse<CategoryResponse>>(`/category/${id}`, {
            method: 'PATCH',
            body: payload,
        })
        return normalizeCategory(response.data)
    },

    async deleteCategory(id: string) {
        const response = await request<DeleteCategoryResponse>(`/category/${id}`, {
            method: 'DELETE',
        })
        return response.length
    },
}
