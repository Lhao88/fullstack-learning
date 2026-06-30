import {
    Button,
    Card,
    Space,
    Tag,
    Typography,
} from 'antd'
const { Paragraph, Text } = Typography
import type { TaskItem, TaskLevel } from '../types/task'
import {useTaskStore} from '../store/taskStore'

const taskLevelMap: Record<TaskLevel, { label: string; color: string; className: string }> = {
    high: {
        label: '高',
        color: 'red',
        className: 'priority-high',
    },
    medium: {
        label: '中',
        color: 'gold',
        className: 'priority-medium',
    },
    low: {
        label: '低',
        color: 'green',
        className: 'priority-low',
    },
}

const formatUpdatedDate = (date: Date) => {
    const today = new Date()
    const isToday =
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()

    if (isToday) {
        return '今天'
    }

    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

interface SingleTaskProps {
    task: TaskItem
}

const SingleTask = ({ task }: SingleTaskProps) => {
    const levelInfo = taskLevelMap[task.level]
    const changeTaskToNextStatus = useTaskStore((state) => state.changeTaskToNextStatus)

    const handleChangeStatus = async () => {
        await changeTaskToNextStatus(task.id)
    }
    
    return(
        <>
            <Card key={task.id} className={`task-card ${levelInfo.className}`} size="small">
                <Space direction="vertical" size={8} className="task-content">
                    <div className="task-title-row">
                        <Text strong>{task.title}</Text>
                        <Tag color={levelInfo.color}>{levelInfo.label}</Tag>
                    </div>
                    <Paragraph type="secondary">
                        {task.description}
                    </Paragraph>
                    <div className="task-footer">
                        <Text type="secondary">{formatUpdatedDate(task.updatedAt)}</Text>
                        {task.status !== 'done' && (
                            <Button size="small" onClick={handleChangeStatus}>
                                {task.status === 'todo' ? '开始' : '完成'}
                            </Button>
                        )}
                    </div>
                </Space>
            </Card>
        </>
    )
}

export default SingleTask
