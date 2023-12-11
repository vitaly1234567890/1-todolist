import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {
    AppBar,
    Box,
    Button,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    IconButton,
    Paper,
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
import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolist-api";
import {FilterValuesType, TodolistDomainType} from "./state/todolists-reducer";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    let todolistID1 = crypto.randomUUID();
    let todolistID2 = crypto.randomUUID();

    let [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
        {id: todolistID1, title: 'What to learn', filter: 'All', addedDate: "", order: 0},
        {id: todolistID2, title: 'What to buy', filter: 'All', addedDate: "", order: 0},
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
        [todolistID1]: [
            {
                id: crypto.randomUUID(), title: "HTML&CSS", status: TaskStatuses.Complited, todoListId: todolistID1,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true
            },
            {
                id: crypto.randomUUID(), title: "JS", status: TaskStatuses.Complited, todoListId: todolistID1,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true
            }
        ],
        [todolistID2]: [
            {
                id: crypto.randomUUID(), title: "HTML&CSS2", status: TaskStatuses.Complited, todoListId: todolistID2,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true
            },
            {
                id: crypto.randomUUID(), title: "JS2", status: TaskStatuses.Complited, todoListId: todolistID2,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true
            }
        ]
    });

    const [isDark, setISDark] = useState(false)

    const addTask = (todolistID: string, title: string) => {
        const newTask: TaskType = {
            id: crypto.randomUUID(),
            title: title,
            status: TaskStatuses.New, todoListId: todolistID,
            startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true
        }
        setTasks({...tasks, [todolistID]: [...tasks[todolistID], newTask]})
    }

    const changeTaskStatus = (todolistsID: string, taskId: string, status: TaskStatuses) => {
        setTasks({
            ...tasks,
            [todolistsID]: tasks[todolistsID].map(el => el.id === taskId ? {...el, status: status} : el)
        })

    }

    const changeTaskTitle = (todolistsID: string, taskId: string, value: string) => {
        setTasks({...tasks, [todolistsID]: tasks[todolistsID].map(el => el.id === taskId ? {...el, title: value} : el)})

    }


    const removeTask = (todolistsID: string, taskId: string) => {
        setTasks({...tasks, [todolistsID]: tasks[todolistsID].filter(el => el.id !== taskId)})
    }

    const changeFilter = (todolistsID: string, nextFilterValue: FilterValuesType) => {
        setTodolists(todolists.map(el => el.id === todolistsID ? {...el, filter: nextFilterValue} : el))
    }

    const removeTodoList = (todolistsID: string) => {
        setTodolists(todolists.filter(f => f.id !== todolistsID))
        delete tasks[todolistsID]
    }

    const changeTodoListTitle = (todolistsID: string, newTitle: string) => {
        let todolist = todolists.find(el => el.id === todolistsID)
        if (todolist) {
            todolist.title = newTitle
            setTodolists([...todolists])
        }
    }

    function addTodoList(title: string) {
        let newTodo: TodolistDomainType = {id: crypto.randomUUID(), title: title, filter: 'All', addedDate: '', order: 0}
        setTodolists([newTodo, ...todolists])
        setTasks({...tasks, [newTodo.id]: []})
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
                                taskForTodolist = tasks[el.id].filter(t => t.status === TaskStatuses.New);
                            }
                            if (el.filter === "Completed") {
                                taskForTodolist = tasks[el.id].filter(t => t.status === TaskStatuses.Complited)
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

export default App;
