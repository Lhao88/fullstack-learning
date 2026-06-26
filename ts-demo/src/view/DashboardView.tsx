import {
    PlusOutlined,
} from '@ant-design/icons'
import {
    Button,
    Layout,
    Row,
    Typography,
} from 'antd'
import { useState } from 'react'

import TaskModal from '../components/TaskModal'
import StateCard from '../components/StateCard'
import TaskColumn from '../components/TaskColumn'
import {useTaskStore } from '../store/taskStore'
import type { TaskFormValues } from '../components/TaskModal'
import type { TaskItem } from '../types/task'

const { Content, Header } = Layout
const { Text, Title } = Typography

const DashboardView = () => {
    const [taskModalOpen, setTaskModalOpen] = useState(false)
    const taskLists = useTaskStore((state) => state.tasks)
    const addTask = useTaskStore((state) => state.addTask)

    const todoCountList = taskLists.filter(item => item.status === 'todo')
    const doingCountList = taskLists.filter(item => item.status === 'in-progress')
    const doneCountList = taskLists.filter(item => item.status === 'done')
    //新增任务
    const handleAddTask = (values : TaskFormValues) => {
        const newTask: TaskItem = {
            id: crypto.randomUUID(),
            title: values.title,
            description: values.description,
            status: 'todo',
            level: values.level,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        addTask(newTask)
    }

    return(
       <>
            <Header className="topbar">
                <div>
                    <Text className="eyebrow">全栈学习计划 · 第 1 周</Text>
                    <Title level={2}>TypeScript 任务管理练习</Title>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setTaskModalOpen(true)}
                >
                    新建任务
                </Button>
            </Header>

            <Content className="workspace-content">
                <Row gutter={[16, 16]} className="stats-row">
                    <StateCard title="全部任务" value={todoCountList.length + doingCountList.length + doneCountList.length} />
                    <StateCard title="待处理" value={todoCountList.length} />
                    <StateCard title="进行中" value={doingCountList.length}  />
                    <StateCard title="已完成" value={doneCountList.length}  />
                    
                </Row>
                <Row gutter={[16, 16]} align="top" className="board-row">
                    <TaskColumn status="todo" taskList={todoCountList} />
                    <TaskColumn status="in-progress" taskList={doingCountList} />
                    <TaskColumn status="done" taskList={doneCountList} />

                </Row>
            </Content>
            <TaskModal
                open={taskModalOpen}
                onCancel={() => setTaskModalOpen(false)}
                onSubmit={(values) => {
                    handleAddTask(values)
                    setTaskModalOpen(false)
                }}
            />
       </>
    )
}

export default DashboardView
