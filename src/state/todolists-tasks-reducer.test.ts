import {TaskStateType, TodolistsType} from "../App";
import {addTodolistAC, removeTodolistAC, TodolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {}
    const startTodolistsState: Array<TodolistsType> = []

    const action = addTodolistAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = TodolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todoListId)
    expect(idFromTodolists).toBe(action.todoListId)
})