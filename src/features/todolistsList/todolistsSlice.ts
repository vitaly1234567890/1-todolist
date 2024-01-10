import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {appActions, RequestStatusType} from "../../app/appSlice";
import {handleServerNetworkError} from "../../utils/error-utils";
import {setTasksTC} from "./tasksSlice";
import {AppThunk} from "../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        removeTodolist: (state, action: PayloadAction<{todolistId: string}>) => {
            const index = state.findIndex(t => t.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{todolist: TodolistType}>) => {
            state.unshift({...action.payload.todolist, filter: "All", entityStatus: "idle"})
        },
        changeTodolistTitle: (state, action: PayloadAction<{todolistId: string, title: string}>) => {
            const index = state.findIndex(t => t.id === action.payload.todolistId)
            if (index !== -1) state[index].title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>) => {
          const todolist = state.find(t => t.id === action.payload.todolistId)
            if(todolist){
                todolist.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{id: string, status: RequestStatusType}>) => {
            const todolist = state.find(t => t.id === action.payload.id)
            if(todolist){
                todolist.entityStatus = action.payload.status
            }
        },
        setTodolist: (state, action: PayloadAction<{todos: TodolistType[]}>) => {
            // return action.payload.todos.map(el => ({...el, filter: "All", entityStatus: "idle"}))
            action.payload.todos.forEach(tl => {
                state.push({...tl, filter: "All", entityStatus: "idle"})
            })
        },
        clearTodos: (state, action: PayloadAction) => {
            return []
        },
    }
})

//thunk
export const getTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.todolist()
        .then(res => {
            dispatch(todolistsActions.setTodolist({todos: res.data}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return res.data
        })
        .then((todos) => {
            todos.forEach((tl) => {
                dispatch(setTasksTC(tl.id))
            })
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(todolistsActions.changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
    todolistAPI.deleteTodolist(todolistId)
        .then(res => {
            dispatch(todolistsActions.removeTodolist({todolistId: todolistId}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.postTodolist(title)
        .then(res => {
            dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            dispatch(todolistsActions.changeTodolistTitle({todolistId, title}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export type FilterValuesType = 'All' | 'Active' | 'Completed'

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}


export const todolistsActions = slice.actions
export const todolistsReducer = slice.reducer