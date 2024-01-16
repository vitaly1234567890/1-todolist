import {AuthAPI} from "../api/todolist-api";
import {LoginType} from "./Login";
import {handleServerNetworkError} from "../utils/handleServerNetworkError";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../app/store";
import {appActions} from "../app/appSlice";
import {todolistsActions} from "../features/todolistsList/todolistsSlice";
import {handleServerAppError} from "../utils/handleServerAppError";

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

// thunks
export const loginTC = (data: LoginType): AppThunk =>async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        const res = await AuthAPI.login(data)
        if(res.data.resultCode === 0){
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
            dispatch(appActions.setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
            handleServerNetworkError((e as ErrorType), dispatch)
    }
}

export const meTC = (): AppThunk =>async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        const res = await AuthAPI.me()
        if(res.data.resultCode === 0){
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
            dispatch(appActions.setAppStatus({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as ErrorType), dispatch)
    } finally {
        dispatch(appActions.setIsInitialized({isInitialized: true}))
    }
}

export const logOutTC = (): AppThunk =>async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        const res = await AuthAPI.logout()
        if(res.data.resultCode === 0){
            dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            dispatch(todolistsActions.clearTodos())
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as ErrorType, dispatch)
    }
}

// types
type ErrorType = {
    message: string
}

export const authActions = slice.actions
export const authReducer = slice.reducer
