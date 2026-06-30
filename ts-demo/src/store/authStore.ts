import { create } from 'zustand'
import { authApi } from '../api/authApi'
import { getAccessToken } from '../api/http'
import type { LoginPayload, RegisterPayload } from '../api/authApi'
import type { AuthUser } from '../types/auth'

interface AuthStoreState {
    user?: AuthUser
    initialized: boolean
    loading: boolean
    error?: string
    initAuth: () => Promise<void>
    login: (payload: LoginPayload) => Promise<void>
    register: (payload: RegisterPayload) => Promise<void>
    logout: () => void
}

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : '认证请求失败'

export const useAuthStore = create<AuthStoreState>((set) => ({
    user: undefined,
    initialized: false,
    loading: false,
    error: undefined,

    initAuth: async () => {
        const token = getAccessToken()

        if (!token) {
            set({ initialized: true, user: undefined })
            return
        }

        set({ loading: true, error: undefined })

        try {
            const user = await authApi.getCurrentUser()
            set({ user, initialized: true, loading: false })
        } catch (error) {
            authApi.logout()
            set({
                user: undefined,
                initialized: true,
                loading: false,
                error: getErrorMessage(error),
            })
        }
    },

    login: async (payload: LoginPayload) => {
        set({ loading: true, error: undefined })

        try {
            const result = await authApi.login(payload)
            set({ user: result.user, loading: false })
        } catch (error) {
            set({ loading: false, error: getErrorMessage(error) })
            throw error
        }
    },

    register: async (payload: RegisterPayload) => {
        set({ loading: true, error: undefined })

        try {
            await authApi.register(payload)
            const result = await authApi.login({
                email: payload.email,
                password: payload.password,
            })
            set({ user: result.user, loading: false })
        } catch (error) {
            set({ loading: false, error: getErrorMessage(error) })
            throw error
        }
    },

    logout: () => {
        authApi.logout()
        set({ user: undefined, error: undefined })
    },
}))
