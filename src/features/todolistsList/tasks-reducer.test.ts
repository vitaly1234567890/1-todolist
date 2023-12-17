import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from './tasks-reducer'
import {TaskStateType} from '../../trash/App'
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import {v1} from "uuid";

let startState: TaskStateType
beforeEach(() => {
    startState =
        {
            'todolistId1': [
                {
                    id: '1',
                    title: 'CSS',
                    status: TaskStatuses.New,
                    todoListId: 'todolistId1',
                    startDate: "",
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    description: '',
                    completed: true
                },
                {
                    id: '2',
                    title: 'JS',
                    status: TaskStatuses.Complited,
                    todoListId: 'todolistId1',
                    startDate: "",
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    description: '',
                    completed: true
                },
                {
                    id: '3',
                    title: 'React',
                    status: TaskStatuses.New,
                    todoListId: 'todolistId1',
                    startDate: "",
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    description: '',
                    completed: true
                }
            ],
            'todolistId2': [
                {
                    id: '1',
                    title: 'bread',
                    status: TaskStatuses.New,
                    todoListId: 'todolistId2',
                    startDate: "",
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    description: '',
                    completed: true
                },
                {
                    id: '2',
                    title: 'milk',
                    status: TaskStatuses.Complited,
                    todoListId: 'todolistId2',
                    startDate: "",
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    description: '',
                    completed: true
                },
                {
                    id: '3',
                    title: 'tea',
                    status: TaskStatuses.New,
                    todoListId: 'todolistId2',
                    startDate: "",
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    description: '',
                    completed: true
                }
            ]
        }
})
test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('todolistId2','2' )

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3)
    expect(endState["todolistId2"].length).toBe(2)
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy()
});

test('correct task should be added to correct array', () => {
    // const action = addTaskAC('juce', 'todolistId2')
    const action = addTaskAC({
        todoListId: "todolistId2",
        title: 'juce',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: "",
        id: "dfdfedf",
        completed: false
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})
test('status of specified task should be changed', () => {

    const action = updateTaskAC('2', {status: TaskStatuses.New}, 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Complited)
})
test('title of specified task should be changed', () => {

    const action = updateTaskAC('2', {title:'bread'}, 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('bread')
    expect(endState['todolistId1'][1].title).toBe('JS')
})
test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC({
        id: v1(),
        title: "title",
        addedDate: '',
        order: 0,
    })

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
    expect(endState[newKey]).toEqual([])
})
test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC('todolistId2')

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})


