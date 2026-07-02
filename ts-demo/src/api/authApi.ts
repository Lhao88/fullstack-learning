import {
    clearAuthTokens,
    getRefreshToken,
    request,
    setAuthTokens,
} from './http'
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

interface LoginResponse {
    accessToken: string
    refreshToken: string
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

        setAuthTokens(response.data.accessToken, response.data.refreshToken)
        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: normalizeUser(response.data.user),
        }
    },

    async refreshSession() {
        const refreshToken = getRefreshToken()

        if (!refreshToken) {
            throw new Error('缺少 refresh token')
        }

        const response = await request<ApiResponse<LoginResponse>>('/auth/refresh', {
            method: 'POST',
            body: { refreshToken },
            auth: false,
        })

        setAuthTokens(response.data.accessToken, response.data.refreshToken)
        return {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: normalizeUser(response.data.user),
        }
    },

    async getCurrentUser() {
        const response = await request<ApiResponse<UserResponse>>('/auth/me')
        return normalizeUser(response.data)
    },

    logout() {
        const refreshToken = getRefreshToken()
        clearAuthTokens()

        if (refreshToken) {
            void request('/auth/logout', {
                method: 'POST',
                body: { refreshToken },
                auth: false,
            }).catch(() => undefined)
        }
    },
}
