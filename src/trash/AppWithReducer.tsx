import React, {useReducer, useState} from 'react';
import '../app/App.css';
import {TodoList} from "../features/todolistsList/todolist/TodoList";
import {AddItemForm} from "../components/addItemForm/AddItemForm";
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
    FilterValuesType, todolistsActions, todolistsReducer,
} from "../features/todolistsList/todolistsSlice";
import {tasksActions, tasksReducer} from "../features/todolistsList/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";
import {v1} from "uuid";

function AppWithReducer() {

    let todolistID1 = crypto.randomUUID();
    let todolistID2 = crypto.randomUUID();

    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistID1, title: 'What to learn', filter: 'All', addedDate: "", order: 0, entityStatus: "idle"},
        {id: todolistID2, title: 'What to buy', filter: 'All', addedDate: "", order: 0, entityStatus: "idle"},
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistID1]: [
            {
                id: crypto.randomUUID(), title: "HTML&CSS", status: TaskStatuses.Complited, todoListId: todolistID1,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true, entityStatus: 'idle'
            },
            {
                id: crypto.randomUUID(), title: "JS", status: TaskStatuses.Complited, todoListId: todolistID1,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true, entityStatus: 'idle'
            }
        ],
        [todolistID2]: [
            {
                id: crypto.randomUUID(), title: "HTML&CSS2", status: TaskStatuses.Complited, todoListId: todolistID2,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true, entityStatus: 'idle'
            },
            {
                id: crypto.randomUUID(), title: "JS2", status: TaskStatuses.Complited, todoListId: todolistID2,
                startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true, entityStatus: 'idle'
            }
        ]
    });

    const [isDark, setISDark] = useState(false)

    const addTask = (todolistID: string, title: string) => {
        const action = tasksActions.addTask({ task:{
                todoListId: todolistID,
                title: title,
                status: TaskStatuses.New,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: 0,
                startDate: "",
                id: "dfdfedf",
                completed: false,
                entityStatus: 'idle'
            }
        })
        dispatchToTasks(action)
    }

    const changeTaskStatus = (todolistsID: string, taskId: string, status: TaskStatuses) => {
        let action = tasksActions.updateTask({ taskId, model: {status}, todolistId: todolistsID})
        dispatchToTasks(action)
    }

    const changeTaskTitle = (todolistsID: string, taskId: string, value: string) => {
        let action = tasksActions.updateTask({taskId, model: {title: value}, todolistId: todolistsID})
        dispatchToTasks(action)
    }

    const removeTask = (todolistsID: string, taskId: string) => {
        dispatchToTasks(tasksActions.removeTask({taskId, todolistId: todolistsID}))
    }

    const changeFilter = (todolistsID: string, nextFilterValue: FilterValuesType) => {
        let action = todolistsActions.changeTodolistFilter({todolistId: todolistsID, filter: nextFilterValue})
        dispatchToTodolists(action)
    }

    const removeTodoList = (todolistsID: string) => {
        let action = todolistsActions.removeTodolist({todolistId: todolistsID})
        dispatchToTodolists(action)
    }

    const changeTodoListTitle = (todolistsID: string, newTitle: string) => {
        dispatchToTodolists(todolistsActions.changeTodolistTitle({todolistId: todolistsID, title: newTitle}))
    }

    function addTodoList(title: string) {
        let action = todolistsActions.addTodolist({
            todolist: {
                id: v1(),
                title: title,
                addedDate: '',
                order: 0,
            }
        })
        dispatchToTodolists(action)
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
                                            todolist={el}
                                            tasks={taskForTodolist}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            addTask={addTask}
                                            changeTaskStatus={changeTaskStatus}
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
