import React, {FC, useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType} from "./App";


type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (nextFilterValue: FilterValuesType) => void
    addTask: (title: string) => void
    changeTaskStatus: (taskId: string, newIsDoneValue: boolean) => void
    filter: FilterValuesType
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

const TodoList: FC<TodoListPropsType> = (
    {title,
        tasks,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
        filter,
    }) => {

    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [inputError, setInputError] = useState(false)


    const listItems: Array<JSX.Element> = tasks.map(t => {
        const onClickRemoveTaskHandler = () => {
            removeTask(t.id)
        }

        const onChangeTaskStatusHandler =
            (e:ChangeEvent<HTMLInputElement>) => {changeTaskStatus(t.id, e.currentTarget.checked)}

        return (
            <li key={t.id}>
                <input
                    onChange={onChangeTaskStatusHandler}
                    type="checkbox"
                    checked={t.isDone}
                />
                <span className={t.isDone ? "task-done" : "task" }>{t.title}</span>
                <button onClick={onClickRemoveTaskHandler}>x</button>
            </li>
        )
    })

    const tasksList: JSX.Element = tasks.length
        ? <ul>{listItems}</ul>
        : <span>Your tasklist is empty</span>


    const onClickAddTask = () => {
        const trimmedTitle = newTaskTitle.trim()
        if(trimmedTitle){
            addTask(trimmedTitle)
        } else {
            setInputError(true)
        }
        setNewTaskTitle("")
    }

    const onKeyDownAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
        event.key === 'enter' && onClickAddTask()
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
        inputError && setInputError(false)
    }


    const isAddBtnDisabled = !newTaskTitle || newTaskTitle.length >= 15

    const userMessage = inputError
        ? <span style={{color: "red"}}> Your title is too empty</span>
        : newTaskTitle.length < 15
        ? <span>Enter new title</span>
        : <span style={{color: "red"}}> Your title is too long</span>

    return (
        <div className='todolist'>
            <h3>{title}
            </h3>
            <div>
                <input
                    value={newTaskTitle}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyDownAddTask}
                    className={inputError ? "input-error" : undefined}
                />
                <button
                    disabled={isAddBtnDisabled}
                    onClick={onClickAddTask}
                >+
                </button>
                <div>
                    {userMessage}
                </div>
            </div>
            {tasksList}
            <div>
                <button
                    className={filter === 'All' ? "btn-active" : undefined}
                    onClick={() => changeFilter('All')}
                >All</button>
                <button
                    className={filter === 'Active' ? "btn-active" : undefined}
                    onClick={() => changeFilter('Active')}
                >Active</button>
                <button
                    className={filter === 'Completed' ? "btn-active" : undefined}
                    onClick={() => changeFilter('Completed')}
                >Completed</button>
            </div>
        </div>
    )
}

export default TodoList;