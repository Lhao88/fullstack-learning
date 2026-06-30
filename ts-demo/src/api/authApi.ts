import { clearAccessToken, request, setAccessToken } from './http'
import type { AuthUser } from '../types/auth'

interface UserResponse {
    id: string
    email: string
    nickname: string | null
    createdAt: string
    updatedAt: string
}

interface ApiResponse<T> {
    code: number
    message?: string
    data: T
}

interface LoginResponse {
    accessToken: string
    user: UserResponse
}

export interface RegisterPayload {
    email: string
    password: string
    nickname?: string
}

export interface LoginPayload {
    email: string
    password: string
}

const normalizeUser = (user: UserResponse): AuthUser => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
})

export const authApi = {
    async register(payload: RegisterPayload) {
        const response = await request<ApiResponse<UserResponse>>('/auth/register', {
            method: 'POST',
            body: payload,
            auth: false,
        })
        return normalizeUser(response.data)
    },

    async login(payload: LoginPayload) {
        const response = await request<ApiResponse<LoginResponse>>('/auth/login', {
            method: 'POST',
            body: payload,
            auth: false,
        })

        setAccessToken(response.data.accessToken)
        return {
            accessToken: response.data.accessToken,
            user: normalizeUser(response.data.user),
        }
    },

    async getCurrentUser() {
        const response = await request<ApiResponse<UserResponse>>('/auth/me')
        return normalizeUser(response.data)
    },

    logout() {
        clearAccessToken()
    },
}
