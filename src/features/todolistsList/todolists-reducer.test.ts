import {
    addTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC, TodolistDomainType,
    TodolistsReducer
} from './todolists-reducer'
import {v1} from 'uuid';

let todolistId1: string
let todolistId2: string

let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'All', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'All', addedDate: '', order: 0}
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

    let todolist = {
        id: "todolistId2",
        title: "New Todolist",
        addedDate: '',
        order: 0,
    }

    const endState = TodolistsReducer
    (startState, addTodolistAC(todolist))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('All')
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




