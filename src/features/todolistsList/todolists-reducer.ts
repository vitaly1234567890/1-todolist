import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = []

export const TodolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.todos.map(el => ({...el, filter: "All"}))
        case 'REMOVE-TODOLIST':
            return state.filter(f => f.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "All"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        }
        default:
            return state
    }
};

// actions
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (todolistId: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId} as const)
export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: todolistId} as const)
export const setTodolistAC = (todos: TodolistType[]) => ({type: 'SET-TODOLIST', todos} as const)

//thunk
export const getTodolistsTC = () => (dispatch: Dispatch<ActionsType>) => todolistAPI.todolist()
    .then(res => {
        dispatch(setTodolistAC(res.data))
    }).catch(console.log)
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistAPI.deleteTodolist(todolistId)
    .then(res => {
        dispatch(removeTodolistAC(todolistId))
    }).catch(console.log)
export const addTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => todolistAPI.postTodolist(title)
    .then(res => {
        dispatch(addTodolistAC(res.data.data.item))
    }).catch(console.log)
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        }).catch(console.log)

// types
type ActionsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistAC>


export type FilterValuesType = 'All' | 'Active' | 'Completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
