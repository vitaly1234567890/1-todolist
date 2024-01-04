import React, {useEffect, useState} from 'react';
import './App.css';
import {
    AppBar,
    Box,
    Button, CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    IconButton, LinearProgress,
    Switch,
    ThemeProvider,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import {amber, teal} from '@mui/material/colors';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {TaskType} from "../api/todolist-api";
import {TodolistsList} from "../features/todolistsList/TodolistsList";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./store";
import {ErrorSnackbar} from "../components/AppSnackbar/AppSnackbar";
import {Login} from "../Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {log} from "util";
import {logOutTC, meTC} from "../Login/auth-reducer";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    demo?: boolean
}

function AppWithRedux({demo = false}: PropsType) {

    const status = useSelector<AppRootStateType>(state => state.app.status)
    const dispatch = useAppDispatch()
    const isInitialized = useSelector<AppRootStateType>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType>(state => state.auth.isLoggedIn)

    const [isDark, setISDark] = useState(false)

    const themes = createTheme({
        palette: {
            primary: teal,
            secondary: amber,
            mode: isDark ? 'dark' : "light"
        }
    })

    const onClickHandler = () => {
        dispatch(logOutTC())
    }

    useEffect(() => {
        dispatch(meTC())
    }, []);

    if (!isInitialized) {
        return (
            <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
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
                            {!!isLoggedIn && <Button color="inherit" endIcon={<LogoutIcon/>} onClick={onClickHandler}>
                                Logout
                            </Button>}
                        </Box>
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList demo={demo}/>}/>
                        <Route path={'login'} element={<Login/>}/>
                        <Route path={'404'} element={<h1 style={{textAlign: "center"}}>Page not found 404</h1>}/>
                        <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                    </Routes>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default AppWithRedux;

