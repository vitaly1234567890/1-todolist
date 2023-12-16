import React, {useEffect, useState} from 'react'
import {ResponseType, TaskType, todolistAPI, TodolistType} from "../api/todolist-api";

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
        todolistAPI.deleteTodolist("3c52bf28-0eec-4e01-a238-003e000cac09")
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
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}


export const GetTask = () => {
    const [state, setState] = useState<TaskType[] | null>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const getTask = () => {
        todolistAPI.task(todolistId)
            .then((res) => {
                setState(res.data.items)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={"todolistId"} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <button onClick={getTask}>get Tasks</button>
        </div>
    </div>
}

export const CreateTask = () => {
    const [state, setState] = useState<ResponseType<{item:TaskType}> | null>(null)
    const [taskTitle, setTaskTitle] = useState<string>("")
    const [todolistId, setTodolistId] = useState<string>("")
    const createTask = () => {
        todolistAPI.postTask(todolistId, taskTitle)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={"todolistId"} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <input placeholder={"Task Title"} value={taskTitle}
                   onChange={(e) => {
                       setTaskTitle(e.currentTarget.value)
                   }}/>
            <button onClick={createTask}>createTask</button>
        </div>
    </div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<ResponseType | null>(null)
    const [taskId, setTaskId] = useState<string>("")
    const [todolistId, setTodolistId] = useState<string>("")
    const deleteTask = () => {
        todolistAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={"todolistId"} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <input placeholder={"taskId"} value={taskId}
                   onChange={(e) => {
                       setTaskId(e.currentTarget.value)
                   }}/>
            <button onClick={deleteTask}>deleteTask</button>
        </div>
    </div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<ResponseType<TaskType> | null>(null)
    const [title, setTitle] = useState<string>("title 1")
    const [deadline, setDeadline] = useState<string>("")
    const [description, setDescription] = useState<string>("Description 1")
    const [priority, setPriority] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>("")
    const [status, setStatus] = useState<number>(0)

    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")
    const updateTask = () => {
        todolistAPI.updateTask(todolistId, taskId,  {
                deadline: "",
                description: description,
                priority: priority,
                startDate: "",
                status: status,
                title: title
            }
        )
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={"todolistId"} value={todolistId} onChange={(e) => {
                setTodolistId(e.currentTarget.value)
            }}/>
            <input placeholder={"taskId"} value={taskId} onChange={(e) => {
                setTaskId(e.currentTarget.value)
            }}/>
            <input placeholder={"Task Title"} value={title} onChange={(e) => {
                setTitle(e.currentTarget.value)
            }}/>
            <input placeholder={"Description"} value={description} onChange={(e) => {
                setDescription(e.currentTarget.value)
            }}/>
            <input placeholder={"Status"} value={status} type="number" onChange={(e) => {
                setStatus(+e.currentTarget.value)
            }}/>
            <input placeholder={"Priority"} value={priority} type="number" onChange={(e) => {
                setPriority(+e.currentTarget.value)
            }}/>
            <button onClick={updateTask}>update Task Title</button>
        </div>
    </div>
}


