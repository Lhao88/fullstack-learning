const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
const ACCESS_TOKEN_KEY = 'task_access_token'
const REFRESH_TOKEN_KEY = 'task_refresh_token'
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: unknown
    auth?: boolean
    retryOnUnauthorized?: boolean
}

export class HttpError extends Error {
    status: number
    data: unknown

    constructor(message: string, status: number, data: unknown) {
        super(message)
        this.name = 'HttpError'
        this.status = status
        this.data = data
    }
}

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setAccessToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const setRefreshToken = (token: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)
}

export const clearAccessToken = () => {
    clearAuthTokens()
}

export const clearAuthTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const getAssetUrl = (url?: string | null) => {
    if (!url) {
        return undefined
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    return `${API_BASE_URL}${url}`
}

const getErrorMessage = (data: unknown) => {
    if (typeof data !== 'object' || data === null || !('message' in data)) {
        return '请求失败'
    }

    const message = (data as { message?: unknown }).message

    if (Array.isArray(message)) {
        return message.join('，')
    }

    if (typeof message === 'string') {
        return message
    }

    return '请求失败'
}

interface RefreshResponse {
    data: {
        accessToken: string
        refreshToken: string
    }
}

const refreshAuthTokens = async () => {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
        return false
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
        clearAuthTokens()
        return false
    }

    const data = (await response.json()) as RefreshResponse
    setAuthTokens(data.data.accessToken, data.data.refreshToken)

    return true
}

export const request = async <T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> => {
    const { method = 'GET', body, auth = true, retryOnUnauthorized = true } = options
    const headers = new Headers()
    const isFormData = body instanceof FormData

    if (body !== undefined && !isFormData) {
        headers.set('Content-Type', 'application/json')
    }

    if (auth) {
        const token = getAccessToken()

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        if (auth && response.status === 401 && retryOnUnauthorized) {
            const refreshed = await refreshAuthTokens()

            if (refreshed) {
                return request<T>(path, {
                    ...options,
                    retryOnUnauthorized: false,
                })
            }

            window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
        }

        if (auth && response.status === 401) {
            clearAuthTokens()
        }

        throw new HttpError(getErrorMessage(data), response.status, data)
    }

    return data as T
}
