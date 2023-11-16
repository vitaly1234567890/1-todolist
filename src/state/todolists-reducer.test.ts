import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    TodolistsReducer
} from './todolists-reducer'
import {FilterValuesType, TodolistsType} from '../App'
import { v1 } from 'uuid';

let todolistId1: string
let todolistId2: string

let startState:Array<TodolistsType>

beforeEach( () => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to buy', filter: 'All'}
    ]
})
test('correct todolist should be removed', () => {

    const endState =
        TodolistsReducer(startState,
            removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})
test('correct todolist should be added', () => {

    let newTodolistTitle = 'New Todolist'

    const endState = TodolistsReducer
    (startState, addTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(newTodolistTitle)
    expect(endState[2].filter).toBe('All')
})
test('correct todolist should change its name', () => {

    let newTodolistTitle = 'New Todolist'

    const action = changeTodolistTitleAC(todolistId2, newTodolistTitle)

    const endState = TodolistsReducer
    (startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})
test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'Completed'

    const action =
        changeTodolistFilterAC(todolistId2, newFilter)

    const endState = TodolistsReducer(startState, action)

    expect(endState[0].filter).toBe('All')
    expect(endState[1].filter).toBe(newFilter)
})




