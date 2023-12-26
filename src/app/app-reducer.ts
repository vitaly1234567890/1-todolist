export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


const initialState: InitialStateType = {
    status: 'idle',
    error: null
}

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const setAppErrorAC = (error: string | null) => ({
    type: 'APP/SET-ERROR', error
} as const)

export const setAppStatusAC = (status: 'idle' | 'loading' | 'succeeded' | 'failed') => ({
    type: 'APP/SET-STATUS', status
} as const)

export type setErrorActiontype = ReturnType<typeof setAppErrorAC>
export type setStatusActiontype = ReturnType<typeof setAppStatusAC>

type ActionsType =
    setErrorActiontype
    | setStatusActiontype