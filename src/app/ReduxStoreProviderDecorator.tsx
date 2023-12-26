import React from "react";
import {Provider} from "react-redux";
import {AppRootStateType, store} from "./store";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../features/todolistsList/tasks-reducer";
import {TodolistsReducer} from "../features/todolistsList/todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";
import {appReducer} from "./app-reducer";
import {thunk} from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: TodolistsReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "All", addedDate: '', order: 0, entityStatus: "idle"},
        {id: "todolistId2", title: "What to buy", filter: "All", addedDate: '', order: 0, entityStatus: "idle"}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Complited, todoListId: "todolistId1",
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true},
            {id: v1(), title: "JS", status: TaskStatuses.New, todoListId: "todolistId1",
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.Complited, todoListId: "todolistId2",
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true},
            {id: v1(), title: "React Book", status: TaskStatuses.New, todoListId: "todolistId2",
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true}
        ]
    },
    app: {
        status: 'idle',
        error: null
    }
};



const StorybookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunk))

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={StorybookStore}>{storyFn()}</Provider>
}