import {create} from 'zustand'
import { taskApi } from '../api/taskApi'
import type { CreateTaskPayload } from '../api/taskApi'
import type { TaskItem } from '../types/task'

export interface TaskStoreState {
    tasks: TaskItem[],
    loading: boolean,
    error?: string,
    fetchTasks: () => Promise<void>,
    addTask: (task: CreateTaskPayload) => Promise<void>,
    removeTask: (taskId: string) => Promise<void>,
    updateTask: (updatedTask: TaskItem) => Promise<void>,
    changeTaskToNextStatus: (taskId: string) => Promise<void>,
    clearTasks: () => void,

}

export const useTaskStore = create<TaskStoreState>((set) => ({
    tasks: [],
    loading: false,
    error: undefined,

    fetchTasks: async () => {
        set({ loading: true, error: undefined })

        try {
            const tasks = await taskApi.getTasks()
            set({ tasks, loading: false })
        } catch (error) {
            set({ loading: false, error: error instanceof Error ? error.message : '任务加载失败' })
        }
    },

    addTask: async (task: CreateTaskPayload) => {
        const createdTask = await taskApi.createTask(task)
        set((state: TaskStoreState) => ({ tasks: [createdTask, ...state.tasks] }))
    },

    removeTask: async (taskId: string) => {
        await taskApi.deleteTask(taskId)
        set((state: TaskStoreState) => ({ tasks: state.tasks.filter((task: TaskItem) => task.id !== taskId) }))
    },

    updateTask: async (updatedTask: TaskItem) => {
        const savedTask = await taskApi.updateTask(updatedTask.id, {
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            level: updatedTask.level,
            categoryId: updatedTask.categoryId ?? null,
        })
        set((state: TaskStoreState) => ({ tasks: state.tasks.map((task: TaskItem) => task.id === savedTask.id ? savedTask : task) }))
    },

    changeTaskToNextStatus: async (taskId: string) => {
        const savedTask = await taskApi.changeTaskToNextStatus(taskId)
        set((state: TaskStoreState) => ({ tasks: state.tasks.map((task: TaskItem) => task.id === savedTask.id ? savedTask : task) }))
    },

    clearTasks: () => set({ tasks: [], error: undefined }),

}))
