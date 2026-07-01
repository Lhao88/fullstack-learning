import {
    CheckCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined,
} from '@ant-design/icons'
import {
    Button,
    Card,
    Col,
    Input,
    Pagination,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd'
import type { TableProps } from 'antd'
import TaskModal from '../components/TaskModal'
//import { taskList } from '../mock/tasks'
import type { TaskItem, TaskLevel, TaskStatus } from '../types/task'
import type { TaskFormValues } from '../components/TaskModal'
import {useTaskStore} from '../store/taskStore'
import { useCategoryStore } from '../store/categoryStore'
import { useEffect, useState } from 'react'

const { Text, Title } = Typography
const PAGE_SIZE = 8

const statusMap: Record<TaskStatus, { color: string; text: string }> = {
    todo: { color: 'blue', text: '待处理' },
    doing: { color: 'gold', text: '进行中' },
    done: { color: 'green', text: '已完成' },
}

const levelMap: Record<TaskLevel, { color: string; text: string }> = {
    high: { color: 'red', text: '高' },
    medium: { color: 'gold', text: '中' },
    low: { color: 'green', text: '低' },
}

const formatDate = (date: Date) =>
    date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })



const TaskListView = () => {
    const taskList = useTaskStore((state) => state.tasks)
    const addTask = useTaskStore((state) => state.addTask)
    const updateTask = useTaskStore((state) => state.updateTask)
    const removeTask = useTaskStore((state) => state.removeTask)
    const changeTaskToNextStatus = useTaskStore((state) => state.changeTaskToNextStatus)
    const categories = useCategoryStore((state) => state.categories)

    const [taskModalOpen, setTaskModalOpen] = useState(false)
    const [editTask, setEditTask] = useState<TaskItem>()

    const [keyword, setKeyword] = useState('')
    const [status, setStatus] = useState<'all' | TaskStatus>('all')
    const [level, setLevel] = useState<'all' | TaskLevel>('all')
    const [categoryId, setCategoryId] = useState<'all' | 'uncategorized' | string>('all')
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        setCurrentPage(1)
    }, [keyword, status, level, categoryId])

    const handleChangeTaskStatus = async (task: TaskItem) => {
        await changeTaskToNextStatus(task.id)
    }

    const columns: TableProps<TaskItem>['columns'] = [
        {
            title: '任务标题',
            dataIndex: 'title',
            key: 'title',
            width: 220,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: TaskStatus) => (
                <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
            ),
        },
        {
            title: '优先级',
            dataIndex: 'level',
            key: 'level',
            width: 90,
            render: (level: TaskLevel) => (
                <Tag color={levelMap[level].color}>{levelMap[level].text}</Tag>
            ),
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            width: 110,
            render: (_, task) => (
                task.category ? (
                    <Tag color={task.category.color}>{task.category.name}</Tag>
                ) : (
                    <Tag>未分类</Tag>
                )
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 130,
            render: (createdAt: Date) => formatDate(createdAt),
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 130,
            render: (updatedAt: Date) => formatDate(updatedAt),
        },
        {
            title: '操作',
            key: 'action',
            width: 240,
            render: (_, record) => (
                <Space size={6}>
                    <Button size="small" icon={<EditOutlined />} onClick={() => {
                        setEditTask(record)
                        setTaskModalOpen(true)
                    }}>
                        编辑
                    </Button>
                    {record.status !== 'done' && (
                        <Button
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleChangeTaskStatus(record)}
                        >
                            {record.status === 'todo' ? '开始' : '完成'}
                        </Button>
                    )}
                    <Popconfirm
                        title="确认删除任务？"
                        description={`删除后将移除「${record.title}」。`}
                        okText="确认"
                        cancelText="取消"
                        onConfirm={() => handleDeleteTask(record.id)}
                    >
                        <Button danger size="small" icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const filterTaskList = taskList.filter((task) => {
        const searchKeyword = keyword.trim().toLowerCase()
        if (!searchKeyword) return true
        return task.title.toLowerCase().includes(searchKeyword) || task.description.toLowerCase().includes(searchKeyword)
    }).filter((task)=>{
        if(status === 'all') return true
        return task.status === status
    }).filter((task)=>{
        if(level === 'all') return true
        return task.level === level
    }).filter((task)=>{
        if(categoryId === 'all') return true
        if(categoryId === 'uncategorized') return !task.categoryId
        return task.categoryId === categoryId
    })
    const paginatedTaskList = filterTaskList.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    )

    //新增任务
        const handleAddTask = async (values : TaskFormValues) => {
            await addTask({
                title: values.title,
                description: values.description,
                level: values.level,
                categoryId: values.categoryId ?? null,
            })
        }
        //更新任务
        const handleUpdateTask = async (values : TaskFormValues) => {
            await updateTask({...editTask, ...values, updatedAt: new Date()} as TaskItem)
        }

        //保存提交
        const handleSubmitTask = async (values : TaskFormValues) => {
    
            if(!editTask){// status 为空时，新建任务
                await handleAddTask(values)
            }
            else{//status 不为空时，更新任务
                await handleUpdateTask(values)
            }
    
        }

        const handleDeleteTask = async (taskId: string) => {
            await removeTask(taskId)
        }
    return (
        <>
            <header className="topbar">
                <div>
                    <Title level={2}>任务列表</Title>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditTask(undefined)
                        setTaskModalOpen(true)}}
                >
                    新建任务
                </Button>
            </header>

            <main className="workspace-content task-list-content">
                <Card className="toolbar-card">
                    <Row gutter={[12, 12]} align="bottom">
                        <Col xs={24} lg={8}>
                            <Text className="field-label">搜索</Text>
                            <Input
                                allowClear
                                prefix={<SearchOutlined />}
                                placeholder="输入任务标题或关键词"
                                value={keyword}
                                onChange = {(e)=> setKeyword(e.target.value)}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={4}>
                            <Text className="field-label">状态</Text>
                            <Select
                                defaultValue="all"
                                value={status}
                                onChange={(value) => setStatus(value as 'all' | TaskStatus)}
                                options={[
                                    { label: '全部', value: 'all' },
                                    { label: '待处理', value: 'todo' },
                                    { label: '进行中', value: 'doing' },
                                    { label: '已完成', value: 'done' },
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={4}>
                            <Text className="field-label">优先级</Text>
                            <Select
                                defaultValue="all"
                                value={level}
                                onChange={(value) => setLevel(value as 'all' | TaskLevel)}
                                options={[
                                    { label: '全部', value: 'all' },
                                    { label: '高', value: 'high' },
                                    { label: '中', value: 'medium' },
                                    { label: '低', value: 'low' },
                                ]}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={4}>
                            <Text className="field-label">分类</Text>
                            <Select
                                value={categoryId}
                                onChange={(value) => setCategoryId(value)}
                                options={[
                                    { label: '全部', value: 'all' },
                                    { label: '未分类', value: 'uncategorized' },
                                    ...categories.map((category) => ({
                                        label: category.name,
                                        value: category.id,
                                    })),
                                ]}
                            />
                        </Col>
                        <Col xs={24} lg={4}>
                            <Button block icon={<ReloadOutlined />}
                            onClick={() => {
                                setKeyword('')
                                setStatus('all')
                                setLevel('all')
                                setCategoryId('all')
                            }}
                            >
                                重置
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <Card className="task-list-card">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={paginatedTaskList}
                        pagination={false}
                        scroll={{ x: 1020, y: 'calc(100vh - 376px)' }}
                    />
                    <div className="table-pagination">
                        <Pagination
                            current={currentPage}
                            pageSize={PAGE_SIZE}
                            total={filterTaskList.length}
                            showSizeChanger={false}
                            showTotal={(total) => `共 ${total} 条`}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </Card>
            </main>
            <TaskModal
                open={taskModalOpen}
                task={editTask}
                onCancel={() => {
                    setTaskModalOpen(false)
                    setEditTask(undefined)
                }}
                onSubmit={async (values) => {
                    await handleSubmitTask(values)
                    setTaskModalOpen(false)
                }}
            />
        </>
    )
}

export default TaskListView
