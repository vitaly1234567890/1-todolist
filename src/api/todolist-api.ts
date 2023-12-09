import axios from 'axios'


const instanse = axios.create({
        baseURL: 'https://social-network.samuraijs.com/api/1.1',
        withCredentials: true,
        headers: {
            'API-KEY': '3e2de8d4-39b0-4187-b03b-a593542bee6f',
        },
    }
)

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
}