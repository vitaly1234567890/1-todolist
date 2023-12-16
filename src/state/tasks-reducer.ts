import {TaskStateType} from "../App";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistType} from "./todolists-reducer";
import {TaskPriorities, TaskType, todolistAPI, UpdateTaskModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

type ActionsType =
    RemoveTaskActionType
    | addTaskActionType
    | updateTaskActionType
    | changeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistType
    | SetTasksActionType

export type RemoveTaskActionType = {
    type: "REMOVE-TASK"
    taskId: string
    todolistId: string
}
export type addTaskActionType = {
    type: 'ADD-TASK'
    task: TaskType
}

export type updateTaskActionType = {
    type: 'UPDATE-TASK'
    taskId: string
    todolistId: string
    model: UpdateDomainTaskModelType
}

export type changeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    todolistId: string
    title: string
}

const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case "SET-TODOLIST": {
            let copy = {...state}
            action.todos.forEach(el => {
                copy[el.id] = []
            })
            return copy
        }
        case 'SET-TASKS': {
            return {...state, [action.todolistId]: action.tasks}
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id !== action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask = action.task
            const tasks = stateCopy[newTask.todoListId]
            const newTasks = [newTask, ...tasks]
            stateCopy[newTask.todoListId] = newTasks
            return stateCopy
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((m) => m.id === action.taskId ? {
                    ...m,
                    ...action.model
                } : m)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((m) => m.id === action.taskId ? {
                    ...m,
                    title: action.title
                } : m)
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }

        case "REMOVE-TODOLIST": {
            let statecopy = {...state}
            delete statecopy[action.id]
            return statecopy
        }
        default:
            return state
    }
};
export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId, todolistId}
}

export const addTaskAC = (task: TaskType): addTaskActionType => {
    return {type: 'ADD-TASK', task}
}

export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string): updateTaskActionType => {
    return {type: 'UPDATE-TASK', taskId, model, todolistId}
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): changeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId}
}

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}
export const setTaskAC = (todolistId: string, tasks: TaskType[]):SetTasksActionType => {
    return {type: 'SET-TASKS', todolistId, tasks} as const
}

export const setTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.task(todolistId).then(res => {
        dispatch(setTaskAC(todolistId, res.data.items))
    })
}

export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.postTask(todolistId, title).then(res => {
        dispatch(addTaskAC(res.data.data.item))
    })
}

export const deleteTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(taskId, todolistId).then(res =>{
        dispatch(removeTaskAC(taskId, todolistId))
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

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType,todolistsID: string) => (dispatch: Dispatch, getState: ()=> AppRootStateType) => {
    const state = getState().tasks[todolistsID]
    const task = state.find(t => t.id === taskId)
    if(!task){
        console.warn("Task is not found")
        return
    }
    let apiModel:UpdateTaskModelType  = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel
    }
    todolistAPI.updateTask(todolistsID, taskId, apiModel).then(res =>{
        dispatch(updateTaskAC(taskId, domainModel, todolistsID))
    })
}


