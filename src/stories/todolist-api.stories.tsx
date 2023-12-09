import React, {useEffect, useState} from 'react'
import {ResponseType, todolistAPI, TodolistType} from "../api/todolist-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<TodolistType[] | null>(null)
    useEffect(() => {
        todolistAPI.todolist()
            .then((res) => {
                setState(res.data)
            })
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<ResponseType | null>(null)
    useEffect(() => {
      todolistAPI.postTodolist('New Todo')
    .then((res) => {
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<ResponseType | null>(null)
    useEffect(() => {
        todolistAPI.deleteTodolist("ee0a508b-7fec-4a9c-8c51-50653fd56898")
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<ResponseType | null>(null)
    useEffect(() => {
        todolistAPI.updateTodolist("aa1d4a33-b7d0-4288-b519-2bf59b599af6", 'React')
            .then((res)=> {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}