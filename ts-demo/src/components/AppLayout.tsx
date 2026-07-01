import {
    AppstoreOutlined,
    InboxOutlined,
    LogoutOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from '@ant-design/icons'
import {
    Avatar,
    Button,
    ConfigProvider,
    Layout,
    Menu,
    Spin,
    Typography,
} from 'antd'

import DashboardView from '../view/DashboardView'
import TaskListView from '../view/TaskListView'
import ArchiveView from '../view/ArchiveView'
import AuthView from '../view/AuthView'
import type { ActiveView } from '../types/activeView'

import { useEffect, useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { useCategoryStore } from '../store/categoryStore'
import { useAuthStore } from '../store/authStore'
import { AUTH_UNAUTHORIZED_EVENT } from '../api/http'

const {  Sider } = Layout
const { Text} = Typography



const AppLayout = () => {
    const [activeView, setActiveView] = useState<ActiveView>('dashboard')
    const user = useAuthStore((state) => state.user)
    const initialized = useAuthStore((state) => state.initialized)
    const authLoading = useAuthStore((state) => state.loading)
    const initAuth = useAuthStore((state) => state.initAuth)
    const logout = useAuthStore((state) => state.logout)
    const fetchTasks = useTaskStore((state) => state.fetchTasks)
    const clearTasks = useTaskStore((state) => state.clearTasks)
    const fetchCategories = useCategoryStore((state) => state.fetchCategories)
    const clearCategories = useCategoryStore((state) => state.clearCategories)

    useEffect(() => {
        void initAuth()
    }, [initAuth])

    useEffect(() => {
        const handleUnauthorized = () => {
            logout()
            clearTasks()
            clearCategories()
            setActiveView('dashboard')
        }

        window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)

        return () => {
            window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
        }
    }, [clearCategories, clearTasks, logout])

    useEffect(() => {
        if (user) {
            void fetchTasks()
            void fetchCategories()
        }
    }, [fetchCategories, fetchTasks, user])

    const handleLogout = () => {
        logout()
        clearTasks()
        clearCategories()
        setActiveView('dashboard')
    }

    if (!initialized) {
        return (
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 8,
                        colorPrimary: '#1677ff',
                        fontFamily:
                            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    },
                }}
            >
                <div className="app-loading">
                    <Spin size="large" />
                </div>
            </ConfigProvider>
        )
    }

    if (!user) {
        return (
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 8,
                        colorPrimary: '#1677ff',
                        fontFamily:
                            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    },
                }}
            >
                <AuthView />
            </ConfigProvider>
        )
    }

    if (authLoading) {
        return null
    }

    const renderView = () => {
        if (activeView === 'tasks') {
            return <TaskListView />
        }

        if (activeView === 'archive') {
            return <ArchiveView />
        }

        return <DashboardView />
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 8,
                    colorPrimary: '#1677ff',
                    fontFamily:
                        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                },
            }}
        >
            <Layout className="app-layout">
                <Sider className="app-sider" width={248} breakpoint="lg" collapsedWidth={0}>
                    <div className="brand">
                        <span className="brand-mark">T</span>
                        <div>
                            <strong>任务看板</strong>
                            <Text type="secondary">Week 01 Practice</Text>
                        </div>
                    </div>

                    <Menu
                        className="side-menu"
                        theme="dark"
                        mode="inline"
                        selectedKeys={[activeView]}
                        onClick={({key}) => setActiveView(key as ActiveView)}
                        items={[
                            {
                                key: 'dashboard',
                                icon: <AppstoreOutlined />,
                                label: '工作台',
                            },
                            {
                                key: 'tasks',
                                icon: <UnorderedListOutlined />,
                                label: '任务列表',
                            },
                            {
                                key: 'archive',
                                icon: <InboxOutlined />,
                                label: '归档记录',
                            },
                        ]}
                    />

                    <div className="sider-user">
                        <div className="sider-user-main">
                            <Avatar size={34} icon={<UserOutlined />} />
                            <div>
                                <Text className="sider-user-name">
                                    {user.nickname || '未命名用户'}
                                </Text>
                                <Text className="sider-user-email">
                                    {user.email}
                                </Text>
                            </div>
                        </div>
                        <Button
                            block
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                        >
                            退出登录
                        </Button>
                    </div>
                </Sider>

                <Layout className="workspace-layout">
                    {renderView()}
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}

export default AppLayout
