import React, {ChangeEvent, FC, memo, useCallback} from 'react';
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem, Paper, Typography} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';


type TodoListPropsType = {
    title: string
    todolistsID: string
    tasks: Array<TaskType>
    removeTask: (todolistsID: string, taskId: string) => void
    changeTodoListTitle: (todolistsID: string, newTitle: string) => void
    changeFilter: (todolistsID: string, nextFilterValue: FilterValuesType) => void
    addTask: (todolistID: string, title: string) => void
    changeTaskStatus: (todolistsID: string, taskId: string, newIsDoneValue: boolean) => void
    changeTaskTitle: (todolistsID: string, taskId: string, value: string) => void
    filter: FilterValuesType
    removeTodoList: (todolistsID: string) => void
}

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export const TodoList: FC<TodoListPropsType> = memo ((

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
    console.log("Todolist")

    let task = tasks
    if (filter === "Active") {
        task = tasks.filter(t => !t.isDone);
    }
    if (filter === "Completed") {
        task = tasks.filter(t => t.isDone)
    }

    const listItems: Array<JSX.Element> = task.map(t => {
        const onClickRemoveTaskHandler = () => {
            removeTask(todolistsID, t.id)
        }

        const onChangeTaskStatusHandler =
            (e: ChangeEvent<HTMLInputElement>) => {
                changeTaskStatus(todolistsID, t.id, e.currentTarget.checked)
            }

        const onChangeTaskTitleHandler = (newValue: string) => {
            changeTaskTitle(todolistsID, t.id, newValue)
        }

        return (
            <Paper sx={{m: "10px"}}
                   elevation={5}
                   key={t.id}
            >
                <ListItem
                    sx={{p: "0"}}
                    >
                    <Checkbox
                        onChange={onChangeTaskStatusHandler}
                        checked={t.isDone}
                    />
                    <span className={t.isDone ? "task-done" : "task"}>
                    <EditableSpan title={t.title} onChange={onChangeTaskTitleHandler}/>
                </span>
                    <ListItemSecondaryAction>
                        <IconButton onClick={onClickRemoveTaskHandler} size="small" color="primary">
                            <HighlightOffIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </Paper>
        )
    })

    const tasksList: JSX.Element = tasks.length
        ? <List>{listItems}</List>
        : <span>Your tasklist is empty</span>

    const removeTodoListHandler = useCallback (() => {
        removeTodoList(todolistsID)
    }, [todolistsID, removeTodoList])

    const changeTodoListTitled = useCallback ((newTitle: string) => {
        changeTodoListTitle(todolistsID, newTitle)
    }, [todolistsID, changeTodoListTitle])

    const addedTask = useCallback ((title: string) => {
        addTask(todolistsID, title)
    }, [todolistsID, addTask])

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
            <div style={{display:"flex", justifyContent: "space-around"}}>
                <Button
                    variant="contained"
                    color={filter === 'All' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={() => changeFilter(todolistsID, 'All',)}
                >All</Button>
                <Button
                    sx={{ml: '12px', mr: '12px'}}
                    variant="contained"
                    color={filter === 'Active' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={() => changeFilter(todolistsID, 'Active')}
                >Active</Button>
                <Button
                    variant="contained"
                    color={filter === 'Completed' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={() => changeFilter(todolistsID, 'Completed')}
                >Completed</Button>
            </div>
        </div>
    )
})
