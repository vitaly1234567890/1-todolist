import {tasksSlice} from '../features/todolistsList/tasksSlice';
import {todolistsReducer} from '../features/todolistsList/todolistsSlice';
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import { configureStore, UnknownAction } from "@reduxjs/toolkit"
import {authReducer} from "../Login/authSlice";
import {appSlice} from "./appSlice";

export const store = configureStore({reducer: {
        tasks: tasksSlice,
        todolists: todolistsReducer,
        app: appSlice,
        auth: authReducer
    }})

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, UnknownAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, UnknownAction>



