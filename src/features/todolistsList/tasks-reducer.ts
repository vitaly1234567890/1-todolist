import {TaskStateType} from "../../trash/App";
import {
    addTodolistAC, removeTodolistAC,
    setTodolistAC,
} from "./todolists-reducer";
import {TaskPriorities, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../../app/store";

const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case "SET-TODOLIST":
            let copy = {...state}
            action.todos.forEach(el => {copy[el.id] = []})
            return copy
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        case 'REMOVE-TASK':
            return {...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'ADD-TASK':
            return {...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map((m) => m.id === action.taskId ? {...m, ...action.model} : m)}
        case 'CHANGE-TASK-TITLE':
            return {...state,
                [action.todolistId]: state[action.todolistId]
                    .map((m) => m.id === action.taskId ? {...m, title: action.title} : m)}
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            let statecopy = {...state}
            delete statecopy[action.id]
            return statecopy
        }
        default:
            return state
    }
};

//actions
export const removeTaskAC = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', taskId, model, todolistId} as const)
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) =>
    ({type: 'CHANGE-TASK-TITLE', taskId, title, todolistId} as const)
export const setTaskAC = (todolistId: string, tasks: TaskType[]) =>
    ({type: 'SET-TASKS', todolistId, tasks} as const)

//thunk
export const setTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => todolistAPI.task(todolistId)
    .then(res => {
        dispatch(setTaskAC(todolistId, res.data.items))
    })
export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistAPI.postTask(todolistId, title).then(res => {
        dispatch(addTaskAC(res.data.data.item))
    })
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) =>
    todolistAPI.deleteTask(todolistId, taskId).then(res => {
        dispatch(removeTaskAC(todolistId, taskId))
    })
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistsID: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
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
        todolistAPI.updateTask(todolistsID, taskId, apiModel).then(res => {
            dispatch(updateTaskAC(taskId, domainModel, todolistsID))
        })
    }

//types
type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTodolistAC>
    | ReturnType<typeof setTaskAC>

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
