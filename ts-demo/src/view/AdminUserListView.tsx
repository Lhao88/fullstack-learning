import {
    EyeOutlined,
    ReloadOutlined,
    StopOutlined,
    UnlockOutlined,
} from '@ant-design/icons'
import {
    Avatar,
    Button,
    Card,
    Descriptions,
    Drawer,
    Popconfirm,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd'
import type { TableProps } from 'antd'
import { useEffect, useState } from 'react'
import { adminApi } from '../api/adminApi'
import { getAssetUrl } from '../api/http'
import type { AdminUser } from '../api/adminApi'
import type { UserRole, UserStatus } from '../types/auth'

const { Text, Title } = Typography

const roleMap: Record<UserRole, { text: string; color: string }> = {
    user: { text: '普通用户', color: 'blue' },
    super_admin: { text: '超级管理员', color: 'purple' },
}

const statusMap: Record<UserStatus, { text: string; color: string }> = {
    enabled: { text: '启用', color: 'green' },
    disabled: { text: '禁用', color: 'red' },
}

const formatDateTime = (date: Date) =>
    date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })

const AdminUserListView = () => {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState<AdminUser>()
    const [detailOpen, setDetailOpen] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)

        try {
            const userList = await adminApi.getUsers()
            setUsers(userList)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchUsers()
    }, [])

    const handleViewUser = async (user: AdminUser) => {
        const detail = await adminApi.getUser(user.id)
        setSelectedUser(detail)
        setDetailOpen(true)
    }

    const handleChangeStatus = async (user: AdminUser) => {
        const nextStatus: UserStatus = user.status === 'enabled' ? 'disabled' : 'enabled'
        const updatedUser = await adminApi.updateUserStatus(user.id, nextStatus)

        setUsers((currentUsers) =>
            currentUsers.map((item) => (item.id === updatedUser.id ? updatedUser : item)),
        )

        if (selectedUser?.id === updatedUser.id) {
            setSelectedUser(updatedUser)
        }
    }

    const columns: TableProps<AdminUser>['columns'] = [
        {
            title: '用户',
            dataIndex: 'email',
            key: 'email',
            render: (_, user) => (
                <Space size={10}>
                    <Avatar src={getAssetUrl(user.avatarUrl)}>
                        {(user.nickname || user.email).slice(0, 1).toUpperCase()}
                    </Avatar>
                    <Space direction="vertical" size={0}>
                        <Text strong>{user.nickname || '未命名用户'}</Text>
                        <Text type="secondary">{user.email}</Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            width: 120,
            render: (role: UserRole) => (
                <Tag color={roleMap[role].color}>{roleMap[role].text}</Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: UserStatus) => (
                <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
            ),
        },
        {
            title: '任务数',
            dataIndex: 'taskCount',
            key: 'taskCount',
            width: 90,
        },
        {
            title: '分类数',
            dataIndex: 'categoryCount',
            key: 'categoryCount',
            width: 90,
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 170,
            render: (date: Date) => formatDateTime(date),
        },
        {
            title: '操作',
            key: 'action',
            width: 220,
            render: (_, user) => (
                <Space size={8}>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewUser(user)}
                    >
                        详情
                    </Button>
                    <Popconfirm
                        title={user.status === 'enabled' ? '确认禁用用户？' : '确认启用用户？'}
                        description={`将${user.status === 'enabled' ? '禁用' : '启用'}「${user.email}」。`}
                        okText="确认"
                        cancelText="取消"
                        onConfirm={() => handleChangeStatus(user)}
                    >
                        <Button
                            size="small"
                            danger={user.status === 'enabled'}
                            icon={user.status === 'enabled' ? <StopOutlined /> : <UnlockOutlined />}
                        >
                            {user.status === 'enabled' ? '禁用' : '启用'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <>
            <header className="topbar">
                <div>
                    <Title level={2}>管理后台</Title>
                </div>
                <Button icon={<ReloadOutlined />} onClick={() => fetchUsers()}>
                    刷新
                </Button>
            </header>

            <main className="workspace-content task-list-content">
                <Card className="task-list-card">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={users}
                        loading={loading}
                        pagination={false}
                        scroll={{ x: 980, y: 'calc(100vh - 260px)' }}
                    />
                </Card>
            </main>

            <Drawer
                title="用户详情"
                open={detailOpen}
                width={520}
                onClose={() => setDetailOpen(false)}
            >
                {selectedUser && (
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="用户 ID">{selectedUser.id}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{selectedUser.email}</Descriptions.Item>
                        <Descriptions.Item label="昵称">
                            {selectedUser.nickname || '未命名用户'}
                        </Descriptions.Item>
                        <Descriptions.Item label="角色">
                            <Tag color={roleMap[selectedUser.role].color}>
                                {roleMap[selectedUser.role].text}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Tag color={statusMap[selectedUser.status].color}>
                                {statusMap[selectedUser.status].text}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="头像">
                            {selectedUser.avatarUrl ? (
                                <Avatar
                                    size={48}
                                    src={getAssetUrl(selectedUser.avatarUrl)}
                                />
                            ) : (
                                '暂无头像'
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="任务数量">
                            {selectedUser.taskCount}
                        </Descriptions.Item>
                        <Descriptions.Item label="分类数量">
                            {selectedUser.categoryCount}
                        </Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {formatDateTime(selectedUser.createdAt)}
                        </Descriptions.Item>
                        <Descriptions.Item label="更新时间">
                            {formatDateTime(selectedUser.updatedAt)}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </>
    )
}

export default AdminUserListView
