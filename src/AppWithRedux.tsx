import React, {useCallback, useEffect, useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {
    AppBar, Box,
    Button,
    Container,
    createTheme, CssBaseline,
    Grid,
    IconButton,
    Paper, Switch,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import {teal} from '@mui/material/colors';
import {amber} from '@mui/material/colors';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC, FilterValuesType, getTodolistsTC,
    removeTodolistTC, TodolistDomainType,
} from "./state/todolists-reducer";
import {
    addTasksTC,
    deleteTaskTC,
    updateTaskTC
} from "./state/tasks-reducer";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./state/store";
import {TaskStatuses, TaskType} from "./api/todolist-api";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    let todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)

    let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)

    const dispatch = useAppDispatch()

    const [isDark, setISDark] = useState(false)

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
        dispatch(deleteTaskTC(taskId, todolistsID))
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
        dispatch(getTodolistsTC())
    }, []);


    const themes = createTheme({
        palette: {
            primary: teal,
            secondary: amber,
            mode: isDark ? 'dark' : "light"
        }
    })

    return (
        <div className="App">
            <ThemeProvider theme={themes}>
                <CssBaseline/>
                <AppBar position="static">
                    <Toolbar style={{justifyContent: "space-between"}}>
                        <IconButton color="inherit">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            TodoLists
                        </Typography>
                        <Box alignItems="center" display="flex" flexDirection="row">
                            <Box display="flex" alignItems="center" marginRight="20px">
                                <LightModeIcon/>
                                <Switch
                                    defaultChecked
                                    color="default"
                                    onChange={(e) => {
                                        setISDark(e.currentTarget.checked)
                                    }}
                                />
                                <DarkModeIcon/>
                            </Box>
                            <Button color="inherit" endIcon={<LogoutIcon/>}>
                                Logout
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Container>
                    <Grid container sx={{p: "15px 0", justifyContent: "center"}}>
                        <AddItemForm addItem={addTodoList}/>
                    </Grid>
                    <Grid container spacing={4}>
                        {todolists.map((el) => {

                            return (
                                <Grid item key={el.id}>
                                    <Paper sx={{p: "15px"}}>
                                        <TodoList
                                            todolistsID={el.id}
                                            title={el.title}
                                            tasks={tasks[el.id]}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeTaskStatus}
                                            filter={el.filter}
                                            removeTodoList={removeTodoList}
                                            changeTaskTitle={changeTaskTitle}
                                            changeTodoListTitle={changeTodoListTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                        }
                    </Grid>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default AppWithRedux;
