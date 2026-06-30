import {
    Badge,
    Card,
    Col,
    Space,
} from 'antd'

import type { TaskItem, TaskLevel, TaskStatus } from '../types/task'
import SingleTask from './SingleTask'

const taskStatusMap: Record<TaskStatus, { title: string; badgeColor: string }> = {
    todo: {
        title: '待处理',
        badgeColor: '#1677ff',
    },
    doing: {
        title: '进行中',
        badgeColor: '#faad14',
    },
    done: {
        title: '已完成',
        badgeColor: '#52c41a',
    },
}

const taskLevelWeight: Record<TaskLevel, number> = {
    high: 3,
    medium: 2,
    low: 1,
}

interface TaskColumnProps {
    status: TaskStatus
    taskList: TaskItem[]
}
const TaskColumn = ({ status, taskList }: TaskColumnProps) => {
    const title = taskStatusMap[status].title
    const count = taskList.length
    const sortedTaskList = [...taskList].sort((a, b) => {
        const levelDiff = taskLevelWeight[b.level] - taskLevelWeight[a.level]

        if (levelDiff !== 0) {
            return levelDiff
        }

        return b.updatedAt.getTime() - a.updatedAt.getTime()
    })

    const taskItems = sortedTaskList.map((task) => {

        return(
            <SingleTask key={task.id} task={task} />
        )
    })
    
    return(
        <>
            <Col xs={24} xl={8}>
                <Card
                    className="board-column"
                    title={title}
                    extra={<Badge count={count} color={taskStatusMap[status].badgeColor} />}
                >
                    <Space direction="vertical" size={12} className="task-stack">

                     {taskItems}

                    </Space>
                </Card>
            </Col>
        </>
    )
}
export default TaskColumn
