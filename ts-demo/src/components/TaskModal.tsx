import {
    Form,
    Input,
    Modal,
    Select,
} from 'antd'
import type { TaskItem, TaskLevel, TaskStatus } from '../types/task'

const { TextArea } = Input

export interface TaskFormValues {
    title: string
    description: string
    status?: TaskStatus
    level: TaskLevel
}

interface TaskModalProps {
    open: boolean
    title?: string
    confirmLoading?: boolean
    task?: TaskItem
    onCancel: () => void
    onSubmit: (values: TaskFormValues, task?: TaskItem) => void
}

const formatDateTime = (date: Date) =>
    date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })

const TaskModal = ({
    open,
    title,
    confirmLoading = false,
    task,
    onCancel,
    onSubmit,
}: TaskModalProps) => {
    const [form] = Form.useForm<TaskFormValues>()
    const isEdit = Boolean(task)

    const modalTitle = title ?? (isEdit ? '编辑任务' : '新建任务')
    const initialValues: TaskFormValues = {
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status,
        level: task?.level ?? 'medium',
    }

    return (
        <Modal
            title={modalTitle}
            open={open}
            okText="保存"
            cancelText="取消"
            confirmLoading={confirmLoading}
            onCancel={onCancel}
            onOk={() => form.submit()}
            afterOpenChange={(isOpen) => {
                if (isOpen) {
                    form.setFieldsValue(initialValues)
                    return
                }

                form.resetFields()
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={(values) => onSubmit(values, task)}
            >
                {isEdit && task && (
                    <>
                        <Form.Item label="任务 ID">
                            <Input value={task.id} disabled />
                        </Form.Item>

                        <Form.Item
                            label="任务状态"
                            name="status"
                            rules={[{ required: true, message: '请选择任务状态' }]}
                        >
                            <Select
                                options={[
                                    { label: '待处理', value: 'todo' },
                                    { label: '进行中', value: 'in-progress' },
                                    { label: '已完成', value: 'done' },
                                ]}
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    label="任务标题"
                    name="title"
                    rules={[
                        { required: true, message: '请输入任务标题' },
                        { max: 30, message: '任务标题不能超过 30 个字符' },
                    ]}
                >
                    <Input placeholder="请输入任务标题" />
                </Form.Item>

                <Form.Item
                    label="任务描述"
                    name="description"
                    rules={[
                        { required: true, message: '请输入任务描述' },
                        { max: 200, message: '任务描述不能超过 200 个字符' },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="请输入任务描述"
                        showCount
                        maxLength={200}
                    />
                </Form.Item>

                <Form.Item
                    label="任务优先级"
                    name="level"
                    rules={[{ required: true, message: '请选择任务优先级' }]}
                >
                    <Select
                        options={[
                            { label: '高', value: 'high' },
                            { label: '中', value: 'medium' },
                            { label: '低', value: 'low' },
                        ]}
                    />
                </Form.Item>

                {isEdit && task && (
                    <>
                        <Form.Item label="创建时间">
                            <Input value={formatDateTime(task.createdAt)} disabled />
                        </Form.Item>

                        <Form.Item label="更新时间">
                            <Input value={formatDateTime(task.updatedAt)} disabled />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    )
}

export default TaskModal
