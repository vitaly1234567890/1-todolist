import {setAppErrorAC, setAppStatusAC, setErrorActiontype, setStatusActiontype} from "../app/app-reducer";
import {ResponseType} from "../api/todolist-api";
import {Dispatch} from "redux";

export const handleServerAppError = <T,>(data: ResponseType<T>, dispatch: Dispatch<setStatusActiontype | setErrorActiontype>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error'))
    }
    dispatch(setAppStatusAC('failed'))
}
export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<setStatusActiontype | setErrorActiontype>) => {
    dispatch(setAppErrorAC(error.message ? error.message : "Some error occurred"))
    dispatch(setAppStatusAC('failed'))
}