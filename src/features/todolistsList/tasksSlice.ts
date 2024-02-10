import {TaskStateType} from "../../trash/App";
import {AddTaskType, TaskPriorities, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {appActions, RequestStatusType} from "../../app/appSlice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistsActions} from "./todolistsSlice";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "../../utils";

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TaskStateType,
    reducers: {
        changeTaskEntityStatus: (state, action: PayloadAction<{
            todolistId: string,
            taskId: string,
            status: RequestStatusType
        }>) => {
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
                return {}
            })
            .addCase(setTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks;
            })
            .addCase(addTasks.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId]
                tasks.unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistsID]
                const index = tasks.findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) {
                    tasks.splice(index, 1)
                }
            })
    },
})

//thunk
const setTasks = createAppAsyncThunk<
    { tasks: TaskType[], todolistId: string }, string>
(`${slice.name}/setTasks`, async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistAPI.task(todolistId)
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {todolistId, tasks: res.data.items}
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const addTasks = createAppAsyncThunk<
    { task: TaskType }, AddTaskType>(`${slice.name}/addTasks`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const res = await todolistAPI.postTask(arg)
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return {task}
            } else
                handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const deleteTask = createAppAsyncThunk<
    { todolistId: string, taskId: string }, { todolistId: string, taskId: string }>(`${slice.name}/deleteTask`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            dispatch(tasksActions.changeTaskEntityStatus({
                todolistId: arg.todolistId,
                taskId: arg.taskId,
                status: 'loading'
            }))
            const res = await todolistAPI.deleteTask(arg.todolistId, arg.taskId)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return {todolistId: arg.todolistId, taskId: arg.taskId}
            } else
                handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

const updateTask = createAppAsyncThunk<
    UpdateTaskArg, UpdateTaskArg>(`${slice.name}/updateTask`,
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI
        try {
            const state = getState().tasks[arg.todolistsID]
            const task = state.find(t => t.id === arg.taskId)
            if (!task) {
                console.warn("Task is not found")
                return rejectWithValue(null)
            }
            let apiModel: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...arg.domainModel
            }
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const res = await todolistAPI.updateTask(arg.todolistsID, arg.taskId, apiModel)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return arg
            } else
                handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)

        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type UpdateTaskArg = { taskId: string, domainModel: UpdateDomainTaskModelType, todolistsID: string }

export const tasksActions = slice.actions
export const tasksSlice = slice.reducer
export const tasksThunks = {setTasks, addTasks, updateTask, deleteTask}

