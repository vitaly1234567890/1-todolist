import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";

type ActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistType

export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST",
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist: TodolistType
}

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    title: string
    id: string
}

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    filter: FilterValuesType
    id: string
}

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'All' | 'Active' | 'Completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const TodolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST": {
            return action.todos.map(el => ({...el, filter: "All"}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(f => f.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist:TodolistDomainType  = {...action.todolist, filter: "All"}
            return [newTodolist, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            let toDo = state.find(el => el.id === action.id)
            if (toDo) {
                toDo.title = action.title
            }
            return [...state]
        }

        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        }
        default:
            return state
    }
};

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}

export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolist}
}

export const changeTodolistTitleAC = (todolistId: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId}
}

export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId}
}

export type SetTodolistType = ReturnType<typeof setTodolistAC>
export const setTodolistAC = (todos: TodolistType[]) => {
    return {type: 'SET-TODOLIST', todos} as const
}

export const getTodolistsTC = () => (dispatch: Dispatch) => {
    todolistAPI.todolist().then(res => {
        dispatch(setTodolistAC(res.data))
    }).catch(console.log)
}

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC(todolistId))
    }).catch(console.log)
}


export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistAPI.postTodolist(title).then(res => {
        dispatch(addTodolistAC(res.data.data.item))
    }).catch(console.log)
}

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.updateTodolist(todolistId, title).then(res => {
        dispatch(changeTodolistTitleAC(todolistId, title))
    }).catch(console.log)
}