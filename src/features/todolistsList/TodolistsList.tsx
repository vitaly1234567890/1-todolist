import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../app/store";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    getTodolistsTC,
    removeTodolistTC,
    TodolistDomainType
} from "./todolists-reducer";
import {addTasksTC, deleteTaskTC, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/addItemForm/AddItemForm";
import {TodoList} from "./todolist/TodoList";
import {TaskStateType} from "../../app/AppWithRedux";

type TodolistsListPropsType = {
    demo?: boolean
}
export const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {
    let todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)

    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useAppDispatch()

    const addTask = useCallback((todolistID: string, title: string) => {
        dispatch(addTasksTC(todolistID, title))
    }, [dispatch])

    const changeTaskStatus = useCallback((todolistsID: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(taskId, {status}, todolistsID))
    }, [dispatch])

    const changeTaskTitle = useCallback((todolistsID: string, taskId: string, value: string) => {
        dispatch(updateTaskTC(taskId, {title: value}, todolistsID))
    }, [dispatch])

    const removeTask = useCallback((todolistsID: string, taskId: string) => {
        dispatch(deleteTaskTC(todolistsID, taskId))
    }, [dispatch])

    const changeFilter = useCallback((todolistsID: string, nextFilterValue: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(todolistsID, nextFilterValue))
    }, [dispatch])

    const removeTodoList = useCallback((todolistsID: string) => {
        dispatch(removeTodolistTC(todolistsID))
    }, [dispatch])

    const changeTodoListTitle = useCallback((todolistsID: string, newTitle: string) => {
        dispatch(changeTodolistTitleTC(todolistsID, newTitle))
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    useEffect(() => {
        if(demo) {
            return
        }
        dispatch(getTodolistsTC())
    }, []);

    return (
        <>
            <Grid container sx={{p: "15px 0", justifyContent: "center"}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container spacing={4}>
                {todolists.map((el) => {

                    return (
                        <Grid item key={el.id}>
                            <Paper sx={{p: "15px"}}>
                                <TodoList
                                    todolist={el}
                                    tasks={tasks[el.id]}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    removeTodoList={removeTodoList}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodoListTitle={changeTodoListTitle}
                                    demo={demo}
                                />
                            </Paper>
                        </Grid>
                    )
                })
                }
            </Grid>
        </>
    )
}