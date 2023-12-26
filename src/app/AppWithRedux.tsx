import React, {useState} from 'react';
import './App.css';
import {
    AppBar,
    Box,
    Button,
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
import {AppRootStateType} from "./store";
import {ErrorSnackbar} from "../components/AppSnackbar/AppSnackbar";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

type PropsType = {
    demo?: boolean
}

function AppWithRedux({demo = false}: PropsType) {

    const status = useSelector<AppRootStateType>(state => state.app.status)

    const [isDark, setISDark] = useState(false)

    const themes = createTheme({
        palette: {
            primary: teal,
            secondary: amber,
            mode: isDark ? 'dark' : "light"
        }
    })

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
                            <Button color="inherit" endIcon={<LogoutIcon/>}>
                                Logout
                            </Button>
                        </Box>
                    </Toolbar>
                    {status === 'loading' && <LinearProgress />}
                </AppBar>
                <Container>
                    <TodolistsList demo={demo}/>
                </Container>

            </ThemeProvider>
        </div>
    );
}

export default AppWithRedux;

