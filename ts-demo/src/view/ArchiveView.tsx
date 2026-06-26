import {
    ClockCircleOutlined,
    EyeOutlined,
    RollbackOutlined,
} from '@ant-design/icons'
import {
    Button,
    Card,
    Col,
    Empty,
    List,
    Modal,
    Row,
    Space,
    Statistic,
    Tag,
    Timeline,
    Typography,
} from 'antd'
import { useState } from 'react'

const { Paragraph, Text, Title } = Typography
import {useTaskStore} from '../store/taskStore'
import type { TaskItem, TaskLevel } from '../types/task'

const levelTextMap: Record<TaskLevel, string> = {
    high: '高',
    medium: '中',
    low: '低',
}

const formatDateTime = (date: Date) =>
    date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })

const getStartOfWeek = (date: Date) => {
    const day = date.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const start = new Date(date)

    start.setDate(date.getDate() + diff)
    start.setHours(0, 0, 0, 0)

    return start
}

const ArchiveView = () => {

    const taskList = useTaskStore((state) => state.tasks)
    const updateTask = useTaskStore((state) => state.updateTask)
    const [viewTask, setViewTask] = useState<TaskItem>()
    const archivedTasks = taskList.filter((task)=>task.status === 'done')
    const startOfWeek = getStartOfWeek(new Date())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7)
    const weekArchivedTasks = archivedTasks.filter((task) => {
        return task.updatedAt >= startOfWeek && task.updatedAt < endOfWeek
    })

    const handleRestoreTask = (task: TaskItem) => {
        updateTask({
            ...task,
            status: 'in-progress',
            updatedAt: new Date(),
        })
    }

    return (
        <>
            <header className="topbar">
                <div>
                    <Text className="eyebrow">任务管理</Text>
                    <Title level={2}>归档记录</Title>
                </div>

            </header>

            <main className="workspace-content">
                <Row gutter={[16, 16]} className="stats-row">
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic title="已完成任务" value={archivedTasks.length} />
                            <Text type="secondary">用于练习归档列表渲染</Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic title="本周归档" value={weekArchivedTasks.length} prefix={<ClockCircleOutlined />} />
                            <Text type="secondary">根据更新时间计算</Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic title="可恢复任务" value={archivedTasks.length} />
                            <Text type="secondary">用于练习状态恢复</Text>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} align="top">
                    <Col xs={24} xl={15}>
                        <Card title="已完成任务">
                            <List
                                dataSource={archivedTasks}
                                locale={{
                                    emptyText: (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description="还没有归档任务"
                                        />
                                    ),
                                }}
                                renderItem={(task) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                size="small"
                                                icon={<EyeOutlined />}
                                                onClick={() => setViewTask(task)}
                                            >
                                                查看
                                            </Button>,
                                            <Button
                                                size="small"
                                                icon={<RollbackOutlined />}
                                                onClick={() => handleRestoreTask(task)}
                                            >
                                                恢复
                                            </Button>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <Space size={8}>
                                                    <Text strong>{task.title}</Text>
                                                    <Tag color="green">已完成</Tag>
                                                    <Tag>{levelTextMap[task.level]}</Tag>
                                                </Space>
                                            }
                                            description={
                                                <Space direction="vertical" size={4}>
                                                    <Paragraph type="secondary">
                                                        {task.description}
                                                    </Paragraph>
                                                    <Text type="secondary">
                                                        完成时间：{formatDateTime(task.updatedAt)}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} xl={9}>
                        <Card title="归档时间线">
                            <Timeline
                                items={archivedTasks.map((task) => ({
                                    color: 'green',
                                    children: (
                                        <Space direction="vertical" size={2}>
                                            <Text strong>{task.title}</Text>
                                            <Text type="secondary">{formatDateTime(task.updatedAt)}</Text>
                                        </Space>
                                    ),
                                }))}
                            />
                        </Card>
                    </Col>
                </Row>
            </main>
            <Modal
                title="任务详情"
                open={Boolean(viewTask)}
                footer={null}
                onCancel={() => setViewTask(undefined)}
            >
                {viewTask && (
                    <Space direction="vertical" size={12}>
                        <Text>
                            <Text strong>任务标题：</Text>
                            {viewTask.title}
                        </Text>
                        <Text>
                            <Text strong>任务描述：</Text>
                            {viewTask.description}
                        </Text>
                        <Text>
                            <Text strong>任务状态：</Text>
                            已完成
                        </Text>
                        <Text>
                            <Text strong>任务优先级：</Text>
                            {levelTextMap[viewTask.level]}
                        </Text>
                        <Text>
                            <Text strong>创建时间：</Text>
                            {formatDateTime(viewTask.createdAt)}
                        </Text>
                        <Text>
                            <Text strong>完成时间：</Text>
                            {formatDateTime(viewTask.updatedAt)}
                        </Text>
                    </Space>
                )}
            </Modal>
        </>
    )
}

export default ArchiveView
