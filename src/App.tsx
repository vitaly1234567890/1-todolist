import React, {useState} from 'react';
import './App.css';
import {TodoList, TaskType} from "./TodoList";
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


export type FilterValuesType = 'All' | 'Active' | 'Completed'
export type TodolistsType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    let todolistID1 = crypto.randomUUID();
    let todolistID2 = crypto.randomUUID();

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'All'},
        {id: todolistID2, title: 'What to buy', filter: 'All'},
    ])

    let [tasks, setTasks] = useState<TaskStateType>({
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
        const newTask: TaskType = {
            id: crypto.randomUUID(),
            title: title,
            isDone: false,
        }
        setTasks({...tasks, [todolistID]: [...tasks[todolistID], newTask]})
    }

    const changeTaskStatus = (todolistsID: string, taskId: string, newIsDoneValue: boolean) => {
        setTasks({
            ...tasks,
            [todolistsID]: tasks[todolistsID].map(el => el.id === taskId ? {...el, isDone: newIsDoneValue} : el)
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
        let newTodo: TodolistsType = {id: crypto.randomUUID(), title: title, filter: 'All'}
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

export default App;
