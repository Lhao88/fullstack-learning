import type { TaskItem, TaskLevel, TaskStatus } from '../types/task'
import type { CategoryItem } from '../types/category'
import { request } from './http'

interface ApiResponse<T> {
    code: number
    message?: string
    data: T
}

interface DeleteTaskResponse {
    code: number
    message: string
    length: number
}

interface TaskResponse {
    id: string
    title: string
    description: string
    status: TaskStatus
    level: TaskLevel
    createdAt: string
    updatedAt: string
    userId: string
    categoryId?: string | null
    category?: CategoryResponse | null
}

interface CategoryResponse {
    id: string
    name: string
    color: string
    createdAt: string
    updatedAt: string
    userId: string
}

export interface CreateTaskPayload {
    title: string
    description: string
    level: TaskLevel
    categoryId?: string | null
}

export interface UpdateTaskPayload {
    title?: string
    description?: string
    status?: TaskStatus
    level?: TaskLevel
    categoryId?: string | null
}

const normalizeCategory = (category: CategoryResponse): CategoryItem => ({
    ...category,
    createdAt: new Date(category.createdAt),
    updatedAt: new Date(category.updatedAt),
})

const normalizeTask = (task: TaskResponse): TaskItem => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    category: task.category ? normalizeCategory(task.category) : null,
})

export const taskApi = {
    async getTasks() {
        const response = await request<ApiResponse<TaskResponse[]>>('/task')
        return response.data.map(normalizeTask)
    },

    async getTask(id: string) {
        const response = await request<ApiResponse<TaskResponse>>(`/task/${id}`)
        return normalizeTask(response.data)
    },

    async createTask(payload: CreateTaskPayload) {
        const response = await request<ApiResponse<TaskResponse>>('/task', {
            method: 'POST',
            body: payload,
        })
        return normalizeTask(response.data)
    },

    async updateTask(id: string, payload: UpdateTaskPayload) {
        const response = await request<ApiResponse<TaskResponse>>(`/task/${id}`, {
            method: 'PATCH',
            body: payload,
        })
        return normalizeTask(response.data)
    },

    async deleteTask(id: string) {
        const response = await request<DeleteTaskResponse>(`/task/${id}`, {
            method: 'DELETE',
        })
        return response.length
    },

    async changeTaskToNextStatus(id: string) {
        const response = await request<ApiResponse<TaskResponse>>(`/task/${id}/status/next`, {
            method: 'PATCH',
        })
        return normalizeTask(response.data)
    },
}
