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
import { useEffect, useState } from 'react'
import type { CreateCategoryPayload } from '../api/categoryApi'
import { useCategoryStore } from '../store/categoryStore'
import type { CategoryItem } from '../types/category'

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

const CategoryManageView = () => {
    const [form] = Form.useForm<CreateCategoryPayload>()
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<CategoryItem>()
    const categories = useCategoryStore((state) => state.categories)
    const loading = useCategoryStore((state) => state.loading)
    const fetchCategories = useCategoryStore((state) => state.fetchCategories)
    const addCategory = useCategoryStore((state) => state.addCategory)
    const updateCategory = useCategoryStore((state) => state.updateCategory)
    const removeCategory = useCategoryStore((state) => state.removeCategory)

    useEffect(() => {
        void fetchCategories()
    }, [fetchCategories])

    const handleOpenCreate = () => {
        setEditingCategory(undefined)
        form.setFieldsValue({
            name: '',
            color: 'blue',
        })
        setModalOpen(true)
    }

    const handleOpenEdit = (category: CategoryItem) => {
        setEditingCategory(category)
        form.setFieldsValue({
            name: category.name,
            color: category.color,
        })
        setModalOpen(true)
    }

    const handleSubmit = async () => {
        const values = await form.validateFields()

        if (editingCategory) {
            await updateCategory(editingCategory.id, values)
            message.success('分类已更新')
        } else {
            await addCategory(values)
            message.success('分类已创建')
        }

        setModalOpen(false)
    }

    const handleDelete = async (category: CategoryItem) => {
        await removeCategory(category.id)
        message.success('分类已删除')
    }

    const columns: TableProps<CategoryItem>['columns'] = [
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
            render: (_, category) => <Tag color={category.color}>{category.name}</Tag>,
        },
        {
            title: '任务数',
            dataIndex: 'taskCount',
            key: 'taskCount',
            width: 110,
            render: (taskCount?: number) => taskCount ?? 0,
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date: Date) => formatDateTime(date),
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 180,
            render: (date: Date) => formatDateTime(date),
        },
        {
            title: '操作',
            key: 'action',
            width: 180,
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
                    <Text type="secondary">共 {categories.length} 个分类</Text>
                </div>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={() => fetchCategories()}>
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
                        scroll={{ x: 860, y: 'calc(100vh - 260px)' }}
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
                        label="分类名称"
                        name="name"
                        rules={[
                            { required: true, message: '请输入分类名称' },
                            { max: 20, message: '分类名称不能超过 20 个字符' },
                        ]}
                    >
                        <Input placeholder="例如：学习" />
                    </Form.Item>
                    <Form.Item label="颜色" name="color">
                        <Select options={colorOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CategoryManageView
