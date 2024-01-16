import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, AppRootStateType} from "../../app/store";
import {
    addTodolistTC,
    changeTodolistTitleTC,
    FilterValuesType,
    getTodolistsTC,
    removeTodolistTC,
    TodolistDomainType, todolistsActions
} from "./todolistsSlice";
import {tasksThunks} from "./tasksSlice";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/addItemForm/AddItemForm";
import {TodoList} from "./todolist/TodoList";
import {TaskStateType} from "../../app/AppWithRedux";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn, selectTasks, selectTodolists} from "../../app/app.selectors";



type TodolistsListPropsType = {
    demo?: boolean
}
export const TodolistsList: React.FC<TodolistsListPropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(selectTodolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch = useDispatch<AppDispatch>()

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(tasksThunks.addTasks({todolistId, title}))
    }, [dispatch])

    const changeTaskStatus = useCallback((todolistsID: string, taskId: string, status: TaskStatuses) => {
        dispatch(tasksThunks.updateTask({taskId, domainModel: {status}, todolistsID}))
    }, [dispatch])

    const changeTaskTitle = useCallback((todolistsID: string, taskId: string, title: string) => {
        dispatch(tasksThunks.updateTask({taskId, domainModel: {title} , todolistsID}))
    }, [dispatch])

    const removeTask = useCallback((todolistId: string, taskId: string) => {
        dispatch(tasksThunks.deleteTask({todolistId, taskId}))
    }, [dispatch])

    const changeFilter = useCallback((todolistsID: string, nextFilterValue: FilterValuesType) => {
        dispatch(todolistsActions.changeTodolistFilter({todolistId: todolistsID,filter: nextFilterValue}))
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
        if(demo || !isLoggedIn) return
        dispatch(getTodolistsTC())
    }, []);

    if (!isLoggedIn){
        return <Navigate to={'/login'} />
    }

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