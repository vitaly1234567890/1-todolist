import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import {TaskType} from "../api/todolist-api";
import {TodolistsList} from "../features/todolistsList/TodolistsList";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "./store";
import {ErrorSnackbar} from "../components/AppSnackbar/AppSnackbar";
import {Login} from "../Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {logOutTC, meTC} from "../Login/authSlice";
import {selectIsInitialized, selectIsLoggedIn, selectStatus} from "./app.selectors";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    demo?: boolean
}

function AppWithRedux({demo = false}: PropsType) {

    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const dispatch = useDispatch<AppDispatch>()

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
                            {isLoggedIn && <Button color="inherit" endIcon={<LogoutIcon/>} onClick={onClickHandler}>
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
        </div>
    );
}

export default AppWithRedux;

