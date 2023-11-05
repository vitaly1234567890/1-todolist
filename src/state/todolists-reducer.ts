import {TodolistsType} from "../App";

type ActionType = {
    type: string
    [key: string]: any
}

export const TodolistsReducer = (state: Array<TodolistsType>, action: ActionType): Array<TodolistsType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
         return state.filter(f => f.id !== action.id)
        }


        default:
            throw new Error('I don\'t understand this type')
    }
};

