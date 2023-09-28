import React, {FC, useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType} from "./App";


type TodoListPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (nextFilterValue: FilterValuesType) => void
    addTask: (title: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

const TodoList: FC<TodoListPropsType> = (
    {
        title,
        tasks,
        removeTask,
        changeFilter,
        addTask,
    }) => {

    const [newTaskTitle, setNewTaskTitle] = useState("")

    // const titleInput = useRef<HTMLInputElement>(null)

    const listItems: Array<JSX.Element> = tasks.map(t => {
        const onClickRemoveTaskHandler = () => {
            removeTask(t.id)
        }

        return (
            <li key={t.id}>
                <input type="checkbox" checked={t.isDone}/>
                <span>{t.title}</span>
                <button onClick={onClickRemoveTaskHandler}>x</button>
            </li>
        )
    })


    const tasksList: JSX.Element = tasks.length
        ? <ul>{listItems}</ul>
        : <span>Your tasklist is empty</span>


    const onClickAddTask = () => {
        addTask(newTaskTitle)
        setNewTaskTitle("")
    }

    const onKeyDownAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
        event.key === 'enter' && onClickAddTask()
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.currentTarget.value)

    const isAddBtnDisabled = !newTaskTitle || newTaskTitle.length >= 15

    const userMessage = newTaskTitle.length < 15
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
            {
                tasksList
            }
            <div>
                <button onClick={() => changeFilter('All')}>All</button>
                <button onClick={() => changeFilter('Active')}>Active</button>
                <button onClick={() => changeFilter('Completed')}>Completed</button>
            </div>
        </div>
    )
}

export default TodoList;