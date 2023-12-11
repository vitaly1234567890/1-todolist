import axios from "axios";


const instanse = axios.create({
        baseURL: 'https://social-network.samuraijs.com/api/1.1',
        withCredentials: true,
        headers: {
            'API-KEY': '3e2de8d4-39b0-4187-b03b-a593542bee6f',
        },
    })

export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type ResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: T
}

export enum TaskStatuses  {
    New = 0,
    InProgress = 1,
    Complited = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
            description: string
            title: string
            completed: boolean
            status: TaskStatuses
            priority: TaskPriorities
            startDate: string
            deadline: string
            id: string
            todoListId: string
            order: number
            addedDate: string
}

type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

export const todolistAPI = {
    todolist() {
        const promise =
            instanse.get<TodolistType[]>('/todo-lists')
        return promise
    },
    postTodolist(title: string) {
        const promise =
            instanse.post<ResponseType<{ item: TodolistType }>>('/todo-lists', {title: 'New Todo'})
        return promise
    },
    deleteTodolist(todolistId: string) {
        const promise =
            instanse.delete<ResponseType>(`/todo-lists/${todolistId}`)
        return promise
    },
    updateTodolist(todolistId: string, title: string) {
        const promise =
            instanse.put<ResponseType>(`/todo-lists/${todolistId}`,
            {title: title})
        return promise
    },

    task(todolistId: string) {
        return instanse.get<TaskType[]>(`/todo-lists/${todolistId}/tasks`)
    },
    postTask(todolistId: string, title: string) {
        const promise =
            instanse.post<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks`,
                {title}
            )
        return promise
    },
    deleteTask(todolistId: string, taskId: string) {
        return instanse.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType){
        return instanse.put<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`,model)
    }
}

