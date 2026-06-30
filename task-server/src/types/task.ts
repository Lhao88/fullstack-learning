//定义任务状态
export type TaskStatus = 'todo' | 'doing' | 'done'
//定义任务优先级
export type TaskLevel = 'high' | 'medium' | 'low'

//定义任务项
export interface TaskItem {
    id:string,
    title:string,
    description:string,
    status:TaskStatus,
    level:TaskLevel,
    createdAt:Date,
    updatedAt:Date
}
