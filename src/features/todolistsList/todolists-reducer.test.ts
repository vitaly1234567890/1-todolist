import {
    FilterValuesType, TodolistDomainType, todolistsActions, todolistsReducer,
} from './todolistsSlice'
import {v1} from 'uuid';
import {RequestStatusType} from "../../app/appSlice";

let todolistId1: string
let todolistId2: string

let startState: Array<TodolistDomainType>

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'All', addedDate: '', order: 0, entityStatus: "idle"},
        {id: todolistId2, title: 'What to buy', filter: 'All', addedDate: '', order: 0, entityStatus: "idle"}
    ]
})
test('correct todolist should be removed', () => {

    const endState =
        todolistsReducer(startState,
            todolistsActions.removeTodolist({todolistId: todolistId1}))

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

    const endState = todolistsReducer
    (startState, todolistsActions.addTodolist({todolist}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('All')
})
test('correct todolist should change its name', () => {

    let newTodolistTitle = 'New Todolist'

    const action = todolistsActions.changeTodolistTitle({todolistId: todolistId2, title: newTodolistTitle})

    const endState = todolistsReducer
    (startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})
test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = 'Completed'

    const action =
       todolistsActions.changeTodolistFilter({todolistId: todolistId2, filter: newFilter})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('All')
    expect(endState[1].filter).toBe(newFilter)
})

test('correct of entity status should be changed', () => {

    let newStatus: RequestStatusType = 'loading'

    const action =
       todolistsActions.changeTodolistEntityStatus({id: todolistId2, status: newStatus})

    const endState = todolistsReducer(startState, action)

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newStatus)
})




