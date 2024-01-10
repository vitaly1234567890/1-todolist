import {TaskStateType} from "../../trash/App";
import {TodolistDomainType, todolistsActions, todolistsReducer} from "./todolistsSlice";
import {tasksSlice} from "./tasksSlice";
import {v1} from "uuid";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const action = todolistsActions.addTodolist({ todolist: {
            id: v1(),
            title: "New Todolist",
            addedDate: '',
            order: 0,
        }
    })

    const endTasksState = tasksSlice(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})
