import React, {FC, memo, useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../components/addItemForm/AddItemForm";
import {EditableSpan} from "../../../components/editableSpan/EditableSpan";
import {Button, IconButton, List, Paper, Typography} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Task from "./task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {FilterValuesType, TodolistDomainType} from "../todolists-reducer";
import {useAppDispatch} from "../../../app/store";
import {setTasksTC} from "../tasks-reducer";

type TodoListPropsType = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    removeTask: (todolistsID: string, taskId: string) => void
    changeTodoListTitle: (todolistsID: string, newTitle: string) => void
    changeFilter: (todolistsID: string, nextFilterValue: FilterValuesType) => void
    addTask: (todolistID: string, title: string) => void
    changeTaskStatus: (todolistsID: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistsID: string, taskId: string, value: string) => void
    removeTodoList: (todolistsID: string) => void
    demo?: boolean
}

export const TodoList: FC<TodoListPropsType> = memo((
    {
        todolist,
        tasks,
        removeTask,
        changeFilter,
        addTask,
        changeTaskStatus,
        removeTodoList,
        changeTaskTitle,
        changeTodoListTitle,
        demo = false
    }) => {

    let task = tasks
    if (todolist.filter === "Active") {
        task = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (todolist.filter === "Completed") {
        task = tasks.filter(t => t.status === TaskStatuses.Complited)
    }

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(setTasksTC(todolist.id))
    }, []);

    const listItems: Array<JSX.Element> = task.map(t =>
        <Task key={t.id}
              tasks={t}
              changeTaskTitle={changeTaskTitle}
              changeTaskStatus={changeTaskStatus}
              removeTask={removeTask}
              todolistsId={todolist.id} />
    )

    const tasksList: JSX.Element = tasks.length
        ? <List>{listItems}</List>
        : <span>Your tasklist is empty</span>

    const removeTodoListHandler = useCallback(() => {
        removeTodoList(todolist.id)
    }, [todolist.id, removeTodoList])

    const changeTodoListTitled = useCallback((newTitle: string) => {
        changeTodoListTitle(todolist.id, newTitle)
    }, [todolist.id, changeTodoListTitle])

    const addedTask = useCallback((title: string) => {
        addTask(todolist.id, title)
    }, [todolist.id, addTask])

    const onAllHandler = () => changeFilter(todolist.id, 'All')
    const onActiveHandler = () => changeFilter(todolist.id, 'Active')
    const onCompletedHandler = () => changeFilter(todolist.id, 'Completed')

    return (
        <div className='todolist'>
            <Paper sx={{p: '5px'}} elevation={5}>
                <Typography textAlign="center" variant="h5" fontWeight="bold">
                    <EditableSpan title={todolist.title} onChange={changeTodoListTitled}/>
                    <IconButton onClick={removeTodoListHandler} size="small" color="primary"
                                disabled={todolist.entityStatus === 'loading'}>
                        <DeleteForeverIcon/>
                    </IconButton>
                </Typography>

                <AddItemForm addItem={addedTask} disabled={todolist.entityStatus === 'loading'}/>
            </Paper>
            {tasksList}
            <div style={{display: "flex", justifyContent: "space-around"}}>
                <Button
                    variant="contained"
                    color={todolist.filter === 'All' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={onAllHandler}
                >All</Button>
                <Button
                    sx={{ml: '12px', mr: '12px'}}
                    variant="contained"
                    color={todolist.filter === 'Active' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={onActiveHandler}
                >Active</Button>
                <Button
                    variant="contained"
                    color={todolist.filter === 'Completed' ? "secondary" : "primary"}
                    size="small"
                    disableElevation
                    onClick={onCompletedHandler}
                >Completed</Button>
            </div>
        </div>
    )
})
