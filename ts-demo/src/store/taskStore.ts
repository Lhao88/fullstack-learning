import {create} from 'zustand'
import {taskList} from '../mock/tasks'
import type { TaskItem } from '../types/task'

export interface TaskStoreState {
    tasks: TaskItem[],
    addTask: (task: TaskItem) => void,
    removeTask: (taskId: string) => void,
    updateTask: (updatedTask: TaskItem) => void,

}

export const useTaskStore = create<TaskStoreState>((set) => ({
    tasks: taskList,

    addTask: (task: TaskItem) => set((state: TaskStoreState) => ({ tasks: [...state.tasks, task] })),

    removeTask: (taskId: string) => set((state: TaskStoreState) => ({ tasks: state.tasks.filter((task: TaskItem) => task.id !== taskId) })),

    updateTask: (updatedTask: TaskItem) => set((state: TaskStoreState) => ({ tasks: state.tasks.map((task: TaskItem) => task.id === updatedTask.id ? updatedTask : task) })),

}))

