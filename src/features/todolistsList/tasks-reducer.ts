import {TaskStateType} from "../../trash/App";
import {TaskPriorities, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {AppRootStateType, AppThunk} from "../../app/store";
import {appActions, RequestStatusType} from "../../app/appSlice";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "./todolistsSlice";

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TaskStateType,
    reducers: {
        removeTask: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks.splice(index, 1)
            }
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
        },
        updateTask: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(task => task.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTask: (state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) => {
            state[action.payload.todolistId] = action.payload.tasks

        },
        changeTaskEntityStatus: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) => {
            const status = state[action.payload.todolistId]
            const index = status.findIndex(s => s.id === action.payload.taskId)
            if (index !== -1) {
                status[index].entityStatus = action.payload.status
            }
        },

    },
    extraReducers: (builder) => {
        builder.addCase(todolistsActions.addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(todolistsActions.setTodolist, (state, action) => {
                action.payload.todos.forEach((el: any) => {
                    state[el.id] = []
                })
            })
            .addCase(todolistsActions.clearTodos, (state, action) => {
                state = {}
            })
    },

})

//thunk
export const setTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.task(todolistId)
        .then(res => {
            dispatch(tasksActions.setTask({todolistId, tasks: res.data.items}))
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
        }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const addTasksTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    todolistAPI.postTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(tasksActions.addTask({task: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            } else
                handleServerAppError(res.data, dispatch)
        }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    dispatch(tasksActions.changeTaskEntityStatus({todolistId, taskId, status: 'loading'}))
    todolistAPI.deleteTask(todolistId, taskId).then(res => {
        dispatch(tasksActions.removeTask({todolistId, taskId}))
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
    }).catch((error) => {
        handleServerNetworkError(error, dispatch)
    })
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistsID: string): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
        const state = getState().tasks[todolistsID]
        const task = state.find(t => t.id === taskId)
        if (!task) {
            console.warn("Task is not found")
            return
        }
        let apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel
        }
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistAPI.updateTask(todolistsID, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(tasksActions.updateTask({taskId, model: domainModel, todolistId: todolistsID}))
                    dispatch(appActions.setAppStatus({status: 'succeeded'}))
                } else
                    handleServerAppError(res.data, dispatch)
            }).catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
    }

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const tasksActions = slice.actions
export const tasksReducer = slice.reducer

