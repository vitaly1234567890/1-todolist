import {tasksReducer} from '../features/todolistsList/tasks-reducer';
import {TodolistsReducer} from '../features/todolistsList/todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {thunk, ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {appReducer} from "./app-reducer";
import {authReducer} from "../Login/auth-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: TodolistsReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

export const useAppDispatch: () => AppDispatch = useDispatch

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

