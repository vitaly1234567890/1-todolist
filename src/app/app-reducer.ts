export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


const initialState: InitialStateType = {
    isInitialized: false,
    status: 'idle',
    error: null
}

export type InitialStateType = {
    isInitialized: boolean
    status: RequestStatusType
    error: string | null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-ISINITIALIZED-STATUS':
            return {...state, isInitialized: action.isInitialized}
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

export const setIsInitializedAC = (isInitialized: boolean) => ({
    type: 'APP/SET-ISINITIALIZED-STATUS', isInitialized
} as const)

export type setErrorActiontype = ReturnType<typeof setAppErrorAC>
export type setStatusActiontype = ReturnType<typeof setAppStatusAC>
export type setIsInitializedActiontype = ReturnType<typeof setIsInitializedAC>

type ActionsType =
    setErrorActiontype
    | setStatusActiontype
    | setIsInitializedActiontype