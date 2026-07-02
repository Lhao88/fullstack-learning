import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons'
import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
} from 'antd'
import type { TableProps } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../api/adminApi'
import type {
    AdminCategory,
    AdminUser,
    CreateAdminCategoryPayload,
} from '../api/adminApi'

const { Text, Title } = Typography

const colorOptions = [
    { label: '蓝色', value: 'blue' },
    { label: '绿色', value: 'green' },
    { label: '紫色', value: 'purple' },
    { label: '红色', value: 'red' },
    { label: '橙色', value: 'orange' },
]

const formatDateTime = (date: Date) =>
    date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })

const AdminCategoryManageView = () => {
    const [form] = Form.useForm<CreateAdminCategoryPayload>()
    const [categories, setCategories] = useState<AdminCategory[]>([])
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<AdminCategory>()

    const userOptions = useMemo(
        () =>
            users.map((user) => ({
                label: `${user.nickname || '未命名用户'}（${user.email}）`,
                value: user.id,
            })),
        [users],
    )

    const fetchData = async () => {
        setLoading(true)

        try {
            const [categoryList, userList] = await Promise.all([
                adminApi.getCategories(),
                adminApi.getUsers(),
            ])
            setCategories(categoryList)
            setUsers(userList)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchData()
    }, [])

    const handleOpenCreate = () => {
        setEditingCategory(undefined)
        form.setFieldsValue({
            userId: undefined,
            name: '',
            color: 'blue',
        })
        setModalOpen(true)
    }

    const handleOpenEdit = (category: AdminCategory) => {
        setEditingCategory(category)
        form.setFieldsValue({
            userId: category.userId,
            name: category.name,
            color: category.color,
        })
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()

        if (editingCategory) {
            const updatedCategory = await adminApi.updateCategory(editingCategory.id, values)
            setCategories((currentCategories) =>
                currentCategories.map((category) =>
                    category.id === updatedCategory.id ? updatedCategory : category,
                ),
            )
            message.success('分类已更新')
        } else {
            const createdCategory = await adminApi.createCategory(values)
            setCategories((currentCategories) => [createdCategory, ...currentCategories])
            message.success('分类已创建')
        }

        setModalOpen(false)
    }

    const handleDelete = async (category: AdminCategory) => {
        await adminApi.deleteCategory(category.id)
        setCategories((currentCategories) =>
            currentCategories.filter((item) => item.id !== category.id),
        )
        message.success('分类已删除')
    }

    const columns: TableProps<AdminCategory>['columns'] = [
        {
            title: '分类',
            dataIndex: 'name',
            key: 'name',
            render: (_, category) => <Tag color={category.color}>{category.name}</Tag>,
        },
        {
            title: '所属用户',
            dataIndex: 'user',
            key: 'user',
            render: (_, category) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{category.user.nickname || '未命名用户'}</Text>
                    <Text type="secondary">{category.user.email}</Text>
                </Space>
            ),
        },
        {
            title: '任务数',
            dataIndex: 'taskCount',
            key: 'taskCount',
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
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 170,
            render: (date: Date) => formatDateTime(date),
        },
        {
            title: '操作',
            key: 'action',
            width: 170,
            render: (_, category) => (
                <Space size={8}>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenEdit(category)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确认删除分类？"
                        description="删除后相关任务会变成未分类。"
                        okText="删除"
                        cancelText="取消"
                        onConfirm={() => handleDelete(category)}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                            删除
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
                    <Title level={2}>分类管理</Title>
                </div>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={() => fetchData()}>
                        刷新
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
                        新建分类
                    </Button>
                </Space>
            </header>

            <main className="workspace-content task-list-content">
                <Card className="task-list-card">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={categories}
                        loading={loading}
                        pagination={false}
                        scroll={{ x: 980, y: 'calc(100vh - 260px)' }}
                    />
                </Card>
            </main>

            <Modal
                title={editingCategory ? '编辑分类' : '新建分类'}
                open={modalOpen}
                okText="保存"
                cancelText="取消"
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="所属用户"
                        name="userId"
                        rules={[{ required: true, message: '请选择所属用户' }]}
                    >
                        <Select
                            showSearch
                            placeholder="请选择用户"
                            optionFilterProp="label"
                            options={userOptions}
                        />
                    </Form.Item>
                    <Form.Item
                        label="分类名称"
                        name="name"
                        rules={[
                            { required: true, message: '请输入分类名称' },
                            { max: 20, message: '分类名称不能超过 20 个字符' },
                        ]}
                    >
                        <Input placeholder="例如：项目" />
                    </Form.Item>
                    <Form.Item label="颜色" name="color">
                        <Select options={colorOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AdminCategoryManageView
