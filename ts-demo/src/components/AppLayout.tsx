import {
    AppstoreOutlined,
    InboxOutlined,
    LogoutOutlined,
    TagsOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    UploadOutlined,
    UserOutlined,
} from '@ant-design/icons'
import {
    Avatar,
    Button,
    ConfigProvider,
    Layout,
    Menu,
    message,
    Spin,
    Typography,
    Upload,
} from 'antd'
import type { UploadProps } from 'antd'

import DashboardView from '../view/DashboardView'
import TaskListView from '../view/TaskListView'
import ArchiveView from '../view/ArchiveView'
import AuthView from '../view/AuthView'
import AdminUserListView from '../view/AdminUserListView'
import AdminCategoryManageView from '../view/AdminCategoryManageView'
import CategoryManageView from '../view/CategoryManageView'
import type { ActiveView } from '../types/activeView'

import { useEffect, useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { useCategoryStore } from '../store/categoryStore'
import { useAuthStore } from '../store/authStore'
import { AUTH_UNAUTHORIZED_EVENT, getAssetUrl } from '../api/http'

const {  Sider } = Layout
const { Text} = Typography



const AppLayout = () => {
    const [activeView, setActiveView] = useState<ActiveView>('dashboard')
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const user = useAuthStore((state) => state.user)
    const initialized = useAuthStore((state) => state.initialized)
    const authLoading = useAuthStore((state) => state.loading)
    const initAuth = useAuthStore((state) => state.initAuth)
    const logout = useAuthStore((state) => state.logout)
    const uploadAvatar = useAuthStore((state) => state.uploadAvatar)
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
            if (user.role === 'super_admin') {
                clearTasks()
                clearCategories()
                if (activeView !== 'admin' && activeView !== 'adminCategories') {
                    setActiveView('admin')
                }
                return
            }

            if (activeView === 'admin' || activeView === 'adminCategories') {
                setActiveView('dashboard')
            }

            void fetchTasks()
            void fetchCategories()
        }
    }, [activeView, clearCategories, clearTasks, fetchCategories, fetchTasks, user])

    const handleLogout = () => {
        logout()
        clearTasks()
        clearCategories()
        setActiveView('dashboard')
    }

    const handleUploadAvatar: UploadProps['beforeUpload'] = async (file) => {
        const isAllowedImage = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)

        if (!isAllowedImage) {
            message.error('只允许上传 png、jpg、webp 图片')
            return false
        }

        if (file.size > 2 * 1024 * 1024) {
            message.error('头像大小不能超过 2MB')
            return false
        }

        setUploadingAvatar(true)

        try {
            await uploadAvatar(file)
            message.success('头像已更新')
        } catch (error) {
            message.error(error instanceof Error ? error.message : '头像上传失败')
        } finally {
            setUploadingAvatar(false)
        }

        return false
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
        if (user.role === 'super_admin') {
            if (activeView === 'adminCategories') {
                return <AdminCategoryManageView />
            }

            return <AdminUserListView />
        }

        if (activeView === 'admin') {
            return <DashboardView />
        }

        if (activeView === 'tasks') {
            return <TaskListView />
        }

        if (activeView === 'archive') {
            return <ArchiveView />
        }

        if (activeView === 'categories') {
            return <CategoryManageView />
        }

        return <DashboardView />
    }

    const menuItems = user.role === 'super_admin'
        ? [
            {
                key: 'admin',
                icon: <TeamOutlined />,
                label: '用户管理',
            },
            {
                key: 'adminCategories',
                icon: <TagsOutlined />,
                label: '分类管理',
            },
        ]
        : [
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
            {
                key: 'categories',
                icon: <TagsOutlined />,
                label: '分类管理',
            },
        ]

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
                        items={menuItems}
                    />

                    <div className="sider-user">
                        <div className="sider-user-main">
                            <Avatar
                                size={34}
                                src={getAssetUrl(user.avatarUrl)}
                                icon={<UserOutlined />}
                            />
                            <div>
                                <Text className="sider-user-name">
                                    {user.nickname || '未命名用户'}
                                </Text>
                                <Text className="sider-user-email">
                                    {user.email}
                                </Text>
                            </div>
                        </div>
                        {user.role === 'user' && (
                            <Upload
                                accept="image/png,image/jpeg,image/webp"
                                beforeUpload={handleUploadAvatar}
                                showUploadList={false}
                                style={{ width: '100%' }}
                            >
                                <Button
                                    block
                                    icon={<UploadOutlined />}
                                    loading={uploadingAvatar}
                                >
                                    上传头像
                                </Button>
                            </Upload>
                        )}
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
