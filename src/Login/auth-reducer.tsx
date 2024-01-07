import { Dispatch } from 'redux'
import {
    setAppStatusAC,
    setErrorActiontype,
    setIsInitializedAC,
    setIsInitializedActiontype,
    setStatusActiontype
} from "../app/app-reducer";
import {AuthAPI} from "../api/todolist-api";
import {LoginType} from "./Login";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {clearTodosAC, ClearTodosType} from "../features/todolistsList/todolists-reducer";

type ErrorType = {
    message: string
}

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginType) =>async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await AuthAPI.login(data)
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
            handleServerNetworkError((e as ErrorType), dispatch)
    }
}

export const meTC = () =>async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await AuthAPI.me()
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as ErrorType), dispatch)
    } finally {
        dispatch(setIsInitializedAC(true))
    }
}

export const logOutTC = () =>async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await AuthAPI.logout()
        if(res.data.resultCode === 0){
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(clearTodosAC())
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as ErrorType), dispatch)
    }
}


// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | setStatusActiontype | setErrorActiontype | setIsInitializedActiontype | ClearTodosType