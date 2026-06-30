import {
    EyeInvisibleOutlined,
    EyeOutlined,
    LockOutlined,
    LoginOutlined,
    MailOutlined,
    StarOutlined,
    UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons'
import {
    Alert,
    Button,
    Checkbox,
    Input,
    Typography,
    message,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, RefObject } from 'react'
import { useAuthStore } from '../store/authStore'

const { Title } = Typography

interface PupilProps {
    size?: number
    maxDistance?: number
    pupilColor?: string
    forceLookX?: number
    forceLookY?: number
}

const Pupil = ({
    size = 12,
    maxDistance = 5,
    pupilColor = '#2d2d2d',
    forceLookX,
    forceLookY,
}: PupilProps) => {
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const pupilRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouseX(event.clientX)
            setMouseY(event.clientY)
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const getPupilPosition = () => {
        if (!pupilRef.current) return { x: 0, y: 0 }

        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY }
        }

        const pupil = pupilRef.current.getBoundingClientRect()
        const pupilCenterX = pupil.left + pupil.width / 2
        const pupilCenterY = pupil.top + pupil.height / 2
        const deltaX = mouseX - pupilCenterX
        const deltaY = mouseY - pupilCenterY
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
        const angle = Math.atan2(deltaY, deltaX)

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        }
    }

    const pupilPosition = getPupilPosition()

    return (
        <div
            ref={pupilRef}
            className="auth-pupil"
            style={{
                width: size,
                height: size,
                backgroundColor: pupilColor,
                transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            }}
        />
    )
}

interface EyeBallProps {
    size?: number
    pupilSize?: number
    maxDistance?: number
    eyeColor?: string
    pupilColor?: string
    isBlinking?: boolean
    forceLookX?: number
    forceLookY?: number
}

const EyeBall = ({
    size = 48,
    pupilSize = 16,
    maxDistance = 10,
    eyeColor = '#fff',
    pupilColor = '#2d2d2d',
    isBlinking = false,
    forceLookX,
    forceLookY,
}: EyeBallProps) => {
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const eyeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouseX(event.clientX)
            setMouseY(event.clientY)
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const getPupilPosition = () => {
        if (!eyeRef.current) return { x: 0, y: 0 }

        if (forceLookX !== undefined && forceLookY !== undefined) {
            return { x: forceLookX, y: forceLookY }
        }

        const eye = eyeRef.current.getBoundingClientRect()
        const eyeCenterX = eye.left + eye.width / 2
        const eyeCenterY = eye.top + eye.height / 2
        const deltaX = mouseX - eyeCenterX
        const deltaY = mouseY - eyeCenterY
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance)
        const angle = Math.atan2(deltaY, deltaX)

        return {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        }
    }

    const pupilPosition = getPupilPosition()

    return (
        <div
            ref={eyeRef}
            className="auth-eye"
            style={{
                width: size,
                height: isBlinking ? 2 : size,
                backgroundColor: eyeColor,
            }}
        >
            {!isBlinking && (
                <div
                    className="auth-pupil"
                    style={{
                        width: pupilSize,
                        height: pupilSize,
                        backgroundColor: pupilColor,
                        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
                    }}
                />
            )}
        </div>
    )
}

const getCharacterPosition = (
    ref: RefObject<HTMLDivElement | null>,
    mouseX: number,
    mouseY: number,
) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 }

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 3
    const deltaX = mouseX - centerX
    const deltaY = mouseY - centerY

    return {
        faceX: Math.max(-15, Math.min(15, deltaX / 20)),
        faceY: Math.max(-10, Math.min(10, deltaY / 30)),
        bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)),
    }
}

const AuthView = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [formError, setFormError] = useState('')
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const [isPurpleBlinking, setIsPurpleBlinking] = useState(false)
    const [isBlackBlinking, setIsBlackBlinking] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
    const [isPurplePeeking, setIsPurplePeeking] = useState(false)
    const login = useAuthStore((state) => state.login)
    const register = useAuthStore((state) => state.register)
    const loading = useAuthStore((state) => state.loading)
    const storeError = useAuthStore((state) => state.error)
    const purpleRef = useRef<HTMLDivElement>(null)
    const blackRef = useRef<HTMLDivElement>(null)
    const yellowRef = useRef<HTMLDivElement>(null)
    const orangeRef = useRef<HTMLDivElement>(null)

    const activePassword = mode === 'login' ? password : registerPassword
    const purplePos = getCharacterPosition(purpleRef, mouseX, mouseY)
    const blackPos = getCharacterPosition(blackRef, mouseX, mouseY)
    const yellowPos = getCharacterPosition(yellowRef, mouseX, mouseY)
    const orangePos = getCharacterPosition(orangeRef, mouseX, mouseY)

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMouseX(event.clientX)
            setMouseY(event.clientY)
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {
        const scheduleBlink = () => {
            const timeout = window.setTimeout(() => {
                setIsPurpleBlinking(true)
                window.setTimeout(() => {
                    setIsPurpleBlinking(false)
                    scheduleBlink()
                }, 150)
            }, Math.random() * 4000 + 3000)

            return timeout
        }

        const timeout = scheduleBlink()
        return () => window.clearTimeout(timeout)
    }, [])

    useEffect(() => {
        const scheduleBlink = () => {
            const timeout = window.setTimeout(() => {
                setIsBlackBlinking(true)
                window.setTimeout(() => {
                    setIsBlackBlinking(false)
                    scheduleBlink()
                }, 150)
            }, Math.random() * 4000 + 3000)

            return timeout
        }

        const timeout = scheduleBlink()
        return () => window.clearTimeout(timeout)
    }, [])

    useEffect(() => {
        if (!isTyping) {
            setIsLookingAtEachOther(false)
            return
        }

        setIsLookingAtEachOther(true)
        const timer = window.setTimeout(() => setIsLookingAtEachOther(false), 800)

        return () => window.clearTimeout(timer)
    }, [isTyping])

    useEffect(() => {
        if (!activePassword || !showPassword) {
            setIsPurplePeeking(false)
            return
        }

        const timeout = window.setTimeout(() => {
            setIsPurplePeeking(true)
            window.setTimeout(() => setIsPurplePeeking(false), 800)
        }, Math.random() * 3000 + 2000)

        return () => window.clearTimeout(timeout)
    }, [activePassword, showPassword, isPurplePeeking])

    const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormError('')

        try {
            await login({ email, password })
            message.success('登录成功')
        } catch (error) {
            setFormError(error instanceof Error ? error.message : '登录失败')
        }
    }

    const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFormError('')

        try {
            await register({
                email: registerEmail,
                password: registerPassword,
                nickname: nickname || undefined,
            })
            message.success('注册成功，已自动登录')
        } catch (error) {
            setFormError(error instanceof Error ? error.message : '注册失败')
        }
    }

    const visibleError = formError || storeError
    const isPeeking = activePassword.length > 0 && showPassword
    const isShielding = activePassword.length > 0 && !showPassword

    return (
        <main className="auth-page auth-playground">
            <section className="auth-visual-panel">
                <div className="auth-brand">
                    <span className="auth-brand-mark">
                        <StarOutlined />
                    </span>
                    <span>任务看板</span>
                </div>

                {/* 左侧角色只负责登录页互动，不参与真实认证逻辑。 */}
                <div className="auth-characters" aria-hidden="true">
                    <div
                        ref={purpleRef}
                        className="auth-character auth-purple"
                        style={{
                            height: isTyping || isShielding ? 440 : 400,
                            transform: isPeeking
                                ? 'skewX(0deg)'
                                : isTyping || isShielding
                                  ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
                                  : `skewX(${purplePos.bodySkew}deg)`,
                        }}
                    >
                        <div
                            className="auth-character-eyes auth-purple-eyes"
                            style={{
                                left: isPeeking ? 20 : isLookingAtEachOther ? 55 : 45 + purplePos.faceX,
                                top: isPeeking ? 35 : isLookingAtEachOther ? 65 : 40 + purplePos.faceY,
                            }}
                        >
                            <EyeBall
                                size={18}
                                pupilSize={7}
                                maxDistance={5}
                                isBlinking={isPurpleBlinking}
                                forceLookX={isPeeking ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                forceLookY={isPeeking ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                            />
                            <EyeBall
                                size={18}
                                pupilSize={7}
                                maxDistance={5}
                                isBlinking={isPurpleBlinking}
                                forceLookX={isPeeking ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                                forceLookY={isPeeking ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                            />
                        </div>
                    </div>

                    <div
                        ref={blackRef}
                        className="auth-character auth-black"
                        style={{
                            transform: isPeeking
                                ? 'skewX(0deg)'
                                : isLookingAtEachOther
                                  ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`
                                  : isTyping || isShielding
                                    ? `skewX(${blackPos.bodySkew * 1.5}deg)`
                                    : `skewX(${blackPos.bodySkew}deg)`,
                        }}
                    >
                        <div
                            className="auth-character-eyes auth-black-eyes"
                            style={{
                                left: isPeeking ? 10 : isLookingAtEachOther ? 32 : 26 + blackPos.faceX,
                                top: isPeeking ? 28 : isLookingAtEachOther ? 12 : 32 + blackPos.faceY,
                            }}
                        >
                            <EyeBall
                                size={16}
                                pupilSize={6}
                                maxDistance={4}
                                isBlinking={isBlackBlinking}
                                forceLookX={isPeeking ? -4 : isLookingAtEachOther ? 0 : undefined}
                                forceLookY={isPeeking ? -4 : isLookingAtEachOther ? -4 : undefined}
                            />
                            <EyeBall
                                size={16}
                                pupilSize={6}
                                maxDistance={4}
                                isBlinking={isBlackBlinking}
                                forceLookX={isPeeking ? -4 : isLookingAtEachOther ? 0 : undefined}
                                forceLookY={isPeeking ? -4 : isLookingAtEachOther ? -4 : undefined}
                            />
                        </div>
                    </div>

                    <div
                        ref={orangeRef}
                        className="auth-character auth-orange"
                        style={{
                            transform: isPeeking ? 'skewX(0deg)' : `skewX(${orangePos.bodySkew}deg)`,
                        }}
                    >
                        <div
                            className="auth-character-eyes auth-orange-eyes"
                            style={{
                                left: isPeeking ? 50 : 82 + orangePos.faceX,
                                top: isPeeking ? 85 : 90 + orangePos.faceY,
                            }}
                        >
                            <Pupil forceLookX={isPeeking ? -5 : undefined} forceLookY={isPeeking ? -4 : undefined} />
                            <Pupil forceLookX={isPeeking ? -5 : undefined} forceLookY={isPeeking ? -4 : undefined} />
                        </div>
                    </div>

                    <div
                        ref={yellowRef}
                        className="auth-character auth-yellow"
                        style={{
                            transform: isPeeking ? 'skewX(0deg)' : `skewX(${yellowPos.bodySkew}deg)`,
                        }}
                    >
                        <div
                            className="auth-character-eyes auth-yellow-eyes"
                            style={{
                                left: isPeeking ? 20 : 52 + yellowPos.faceX,
                                top: isPeeking ? 35 : 40 + yellowPos.faceY,
                            }}
                        >
                            <Pupil forceLookX={isPeeking ? -5 : undefined} forceLookY={isPeeking ? -4 : undefined} />
                            <Pupil forceLookX={isPeeking ? -5 : undefined} forceLookY={isPeeking ? -4 : undefined} />
                        </div>
                        <div
                            className="auth-mouth"
                            style={{
                                left: isPeeking ? 10 : 40 + yellowPos.faceX,
                                top: isPeeking ? 88 : 88 + yellowPos.faceY,
                            }}
                        />
                    </div>
                </div>

            </section>

            <section className="auth-form-panel">
                <div className="auth-mobile-brand">
                    <span className="auth-brand-mark">
                        <StarOutlined />
                    </span>
                    <span>任务看板</span>
                </div>

                <div className="auth-form-card">
                    <div className="auth-form-header">
                        <Title level={1}>
                            {mode === 'login' ? '欢迎回来' : '创建账号'}
                        </Title>
                    </div>

                    <div className="auth-mode-toggle">
                        <button
                            type="button"
                            className={mode === 'login' ? 'active' : ''}
                            onClick={() => {
                                setMode('login')
                                setFormError('')
                            }}
                        >
                            登录
                        </button>
                        <button
                            type="button"
                            className={mode === 'register' ? 'active' : ''}
                            onClick={() => {
                                setMode('register')
                                setFormError('')
                            }}
                        >
                            注册
                        </button>
                    </div>

                    {visibleError && (
                        <Alert
                            className="auth-alert"
                            type="error"
                            message={visibleError}
                            showIcon
                        />
                    )}

                    {mode === 'login' ? (
                        <form className="auth-form" onSubmit={handleLoginSubmit}>
                            <label htmlFor="login-email">邮箱</label>
                            <Input
                                id="login-email"
                                type="email"
                                size="large"
                                prefix={<MailOutlined />}
                                placeholder="user@example.com"
                                value={email}
                                autoComplete="off"
                                onChange={(event) => setEmail(event.target.value)}
                                onFocus={() => setIsTyping(true)}
                                onBlur={() => setIsTyping(false)}
                                required
                            />

                            <label htmlFor="login-password">密码</label>
                            <Input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                size="large"
                                prefix={<LockOutlined />}
                                suffix={
                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        aria-label={showPassword ? '隐藏密码' : '显示密码'}
                                    >
                                        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </button>
                                }
                                placeholder="请输入密码"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                onFocus={() => setIsTyping(true)}
                                onBlur={() => setIsTyping(false)}
                                required
                            />

                            <div className="auth-form-row">
                                <Checkbox>保持登录状态</Checkbox>
                                <button type="button" className="auth-link-button">
                                    忘记密码？
                                </button>
                            </div>

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                icon={<LoginOutlined />}
                                loading={loading}
                                block
                            >
                                登录
                            </Button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleRegisterSubmit}>
                            <label htmlFor="register-email">邮箱</label>
                            <Input
                                id="register-email"
                                type="email"
                                size="large"
                                prefix={<MailOutlined />}
                                placeholder="user@example.com"
                                value={registerEmail}
                                autoComplete="off"
                                onChange={(event) => setRegisterEmail(event.target.value)}
                                onFocus={() => setIsTyping(true)}
                                onBlur={() => setIsTyping(false)}
                                required
                            />

                            <label htmlFor="register-nickname">昵称</label>
                            <Input
                                id="register-nickname"
                                size="large"
                                prefix={<UserOutlined />}
                                placeholder="请输入昵称"
                                value={nickname}
                                onChange={(event) => setNickname(event.target.value)}
                            />

                            <label htmlFor="register-password">密码</label>
                            <Input
                                id="register-password"
                                type={showPassword ? 'text' : 'password'}
                                size="large"
                                prefix={<LockOutlined />}
                                suffix={
                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        aria-label={showPassword ? '隐藏密码' : '显示密码'}
                                    >
                                        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </button>
                                }
                                placeholder="至少 6 个字符"
                                value={registerPassword}
                                onChange={(event) => setRegisterPassword(event.target.value)}
                                onFocus={() => setIsTyping(true)}
                                onBlur={() => setIsTyping(false)}
                                minLength={6}
                                required
                            />

                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                icon={<UserAddOutlined />}
                                loading={loading}
                                block
                            >
                                注册并登录
                            </Button>
                        </form>
                    )}

                    {/* 认证说明保留在代码中：登录成功后 token 写入 localStorage，请求工具会自动携带 Authorization。 */}
                </div>
            </section>
        </main>
    )
}

export default AuthView
