import React, {FC, memo, useCallback} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton, List, Paper, Typography} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Task from "./Task";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {FilterValuesType} from "./state/todolists-reducer";

type TodoListPropsType = {
    title: string
    todolistsID: string
    tasks: Array<TaskType>
    removeTask: (todolistsID: string, taskId: string) => void
    changeTodoListTitle: (todolistsID: string, newTitle: string) => void
    changeFilter: (todolistsID: string, nextFilterValue: FilterValuesType) => void
    addTask: (todolistID: string, title: string) => void
    changeTaskStatus: (todolistsID: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistsID: string, taskId: string, value: string) => void
    filter: FilterValuesType
    removeTodoList: (todolistsID: string) => void
}

export const TodoList: FC<TodoListPropsType> = memo((
    {
        title,
        tasks,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
        filter,
        todolistsID,
        removeTodoList,
        changeTaskTitle,
        changeTodoListTitle
    }) => {

    let task = tasks
    if (filter === "Active") {
        task = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === "Completed") {
        task = tasks.filter(t => t.status === TaskStatuses.Complited)
    }

    const listItems: Array<JSX.Element> = task.map(t =>
        <Task key={t.id}
              tasks={t}
              changeTaskTitle={changeTaskTitle}
              changeTaskStatus={changeTaskStatus}
              removeTask={removeTask}
              todolistsId={todolistsID} />
    )

    const tasksList: JSX.Element = tasks.length
        ? <List>{listItems}</List>
        : <span>Your tasklist is empty</span>

    const removeTodoListHandler = useCallback(() => {
        removeTodoList(todolistsID)
    }, [todolistsID, removeTodoList])

    const changeTodoListTitled = useCallback((newTitle: string) => {
        changeTodoListTitle(todolistsID, newTitle)
    }, [todolistsID, changeTodoListTitle])

    const addedTask = useCallback((title: string) => {
        addTask(todolistsID, title)
    }, [todolistsID, addTask])

    const onAllHandler = () => changeFilter(todolistsID, 'All')
    const onActiveHandler = () => changeFilter(todolistsID, 'Active')
    const onCompletedHandler = () => changeFilter(todolistsID, 'Completed')

    return (
        <div className='todolist'>
            <Paper sx={{p: '5px'}} elevation={5}>
                <Typography textAlign="center" variant="h5" fontWeight="bold">
                    <EditableSpan title={title} onChange={changeTodoListTitled}/>
                    <IconButton onClick={removeTodoListHandler} size="small" color="primary">
                        <DeleteForeverIcon/>
                    </IconButton>
                </Typography>

                <AddItemForm addItem={addedTask}/>
            </Paper>
            {tasksList}
            <div style={{display: "flex", justifyContent: "space-around"}}>
                <Button
                    variant="contained"
                    color={filter === 'All' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={onAllHandler}
                >All</Button>
                <Button
                    sx={{ml: '12px', mr: '12px'}}
                    variant="contained"
                    color={filter === 'Active' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={onActiveHandler}
                >Active</Button>
                <Button
                    variant="contained"
                    color={filter === 'Completed' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={onCompletedHandler}
                >Completed</Button>
            </div>
        </div>
    )
})
