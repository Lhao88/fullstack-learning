const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'
const ACCESS_TOKEN_KEY = 'task_access_token'
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    body?: unknown
    auth?: boolean
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

export const setAccessToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const clearAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
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

export const request = async <T>(path: string, options: RequestOptions = {}) => {
    const { method = 'GET', body, auth = true } = options
    const headers = new Headers()

    if (body !== undefined) {
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
        body: body === undefined ? undefined : JSON.stringify(body),
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        if (auth && response.status === 401) {
            clearAccessToken()
            window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT))
        }

        throw new HttpError(getErrorMessage(data), response.status, data)
    }

    return data as T
}
