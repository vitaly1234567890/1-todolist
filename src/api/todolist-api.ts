import axios, {AxiosResponse} from "axios";
import {LoginType} from "../Login/Login";
import {RequestStatusType} from "../app/appSlice";

const instanse = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': '3e2de8d4-39b0-4187-b03b-a593542bee6f',
    },
})

// api
export class AuthAPI {
    static login(data: LoginType) {
        return instanse.post<ResponseType<{ userId: number }>, AxiosResponse<ResponseType<{
            userId: number
        }>>, LoginType>('/auth/login', data)
    }

    static logout() {
        return instanse.delete<ResponseType>('/auth/login')
    }

    static me() {
        return instanse.get<ResponseType<UserType>>('/auth/me')
    }
}


export const todolistAPI = {
    todolist() {
        return instanse.get<TodolistType[]>('/todo-lists')

    },
    postTodolist(title: string) {
        return instanse.post<ResponseType<{ item: TodolistType }>>('/todo-lists', {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instanse.delete<ResponseType>(`/todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instanse.put<ResponseType>(`/todo-lists/${todolistId}`,
            {title: title})
    },

    task(todolistId: string) {
        return instanse.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
    },

    postTask(arg: AddTaskType) {
        return instanse.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${arg.todolistId}/tasks`,
            {title: arg.title}
        )
    },
    deleteTask(todolistId: string, taskId: string) {
        return instanse.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },

    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instanse.put<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}

// types

export type AddTaskType = {
    todolistId: string
    title: string
}

export type UserType = {
    id: number
    email: string
    login: string
}

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

export enum TaskStatuses {
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
    entityStatus: RequestStatusType
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}