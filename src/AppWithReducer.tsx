import React, {useReducer, useState} from 'react';
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
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    TodolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";


export type FilterValuesType = 'All' | 'Active' | 'Completed'

function AppWithReducer() {

    let todolistID1 = crypto.randomUUID();
    let todolistID2 = crypto.randomUUID();

    let [todolists, dispatchToTodolists] = useReducer(TodolistsReducer, [
        {id: todolistID1, title: 'What to learn', filter: 'All'},
        {id: todolistID2, title: 'What to buy', filter: 'All'},
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistID1]: [
            {id: crypto.randomUUID(), title: "HTML&CSS", isDone: true},
            {id: crypto.randomUUID(), title: "JS", isDone: true},
            {id: crypto.randomUUID(), title: "ReactJS", isDone: false},
            {id: crypto.randomUUID(), title: "Rest API", isDone: false},
            {id: crypto.randomUUID(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: crypto.randomUUID(), title: "HTML&CSS2", isDone: true},
            {id: crypto.randomUUID(), title: "JS2", isDone: true},
            {id: crypto.randomUUID(), title: "ReactJS2", isDone: false},
            {id: crypto.randomUUID(), title: "Rest API2", isDone: false},
            {id: crypto.randomUUID(), title: "GraphQL2", isDone: false},
        ]
    });

    const [isDark, setISDark] = useState(false)

    const addTask = (todolistID: string, title: string) => {
        let action = addTaskAC(title, todolistID)
        dispatchToTasks(action)
    }

    const changeTaskStatus = (todolistsID: string, taskId: string, newIsDoneValue: boolean) => {
        let action = changeTaskStatusAC(taskId, newIsDoneValue, todolistsID)
        dispatchToTasks(action)
    }

    const changeTaskTitle = (todolistsID: string, taskId: string, value: string) => {
        let action = changeTaskTitleAC(taskId, value, todolistsID)
        dispatchToTasks(action)
    }

    const removeTask = (todolistsID: string, taskId: string) => {
        dispatchToTasks(removeTaskAC(taskId, todolistsID))
    }

    const changeFilter = (todolistsID: string, nextFilterValue: FilterValuesType) => {
        let action = changeTodolistFilterAC(todolistsID, nextFilterValue)
        dispatchToTodolists(action)
    }

    const removeTodoList = (todolistsID: string) => {
        let action = removeTodolistAC(todolistsID)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const changeTodoListTitle = (todolistsID: string, newTitle: string) => {
        dispatchToTodolists(changeTodolistTitleAC(todolistsID, newTitle))
    }

    function addTodoList(title: string) {
        let action = addTodolistAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }

    const theme = createTheme({
        palette: {
            primary: teal,
            secondary: amber,
            mode: isDark ? 'dark' : "light"
        }
    })

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
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
                            let taskForTodolist = tasks[el.id];
                            if (el.filter === "Active") {
                                taskForTodolist = tasks[el.id].filter(t => !t.isDone);
                            }
                            if (el.filter === "Completed") {
                                taskForTodolist = tasks[el.id].filter(t => t.isDone)
                            }
                            return (
                                <Grid item key={el.id}>
                                    <Paper sx={{p: "15px"}}>
                                        <TodoList
                                            todolistsID={el.id}
                                            title={el.title}
                                            tasks={taskForTodolist}
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
export default AppWithReducer;
