import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";


export type FilterValuesType = 'All' | 'Active' | 'Completed'
type TodolistsType = {
    id: string
    title: string
    filter:FilterValuesType
}


function App() {
    let todolistID1=crypto.randomUUID();
    let todolistID2=crypto.randomUUID();

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistID1, title: 'What to learn', filter: 'All'},
        {id: todolistID2, title: 'What to buy', filter: 'All'},
    ])

    let [tasks, setTasks] = useState({
        [todolistID1]:[
            {id: crypto.randomUUID(), title: "HTML&CSS", isDone: true},
            {id: crypto.randomUUID(), title: "JS", isDone: true},
            {id: crypto.randomUUID(), title: "ReactJS", isDone: false},
            {id: crypto.randomUUID(), title: "Rest API", isDone: false},
            {id: crypto.randomUUID(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]:[
            {id: crypto.randomUUID(), title: "HTML&CSS2", isDone: true},
            {id: crypto.randomUUID(), title: "JS2", isDone: true},
            {id: crypto.randomUUID(), title: "ReactJS2", isDone: false},
            {id: crypto.randomUUID(), title: "Rest API2", isDone: false},
            {id: crypto.randomUUID(), title: "GraphQL2", isDone: false},
        ]
    });

    const addTask = (todolistID: string, title: string) => {
        const newTask: TaskType = {
            id: crypto.randomUUID(),
            title: title,
            isDone: false,
        }
        setTasks( {...tasks, [todolistID]: [...tasks[todolistID], newTask]} )
    }

    const changeTaskStatus = (todolistsID: string, taskId: string, newIsDoneValue: boolean) => {
        setTasks ( {...tasks, [todolistsID]:tasks[todolistsID].map(el => el.id ===taskId ? {...el, isDone:newIsDoneValue} : el) } )

    }


    const removeTask = (todolistsID: string, taskId: string) => {
        setTasks({...tasks, [todolistsID]: tasks[todolistsID].filter( el => el.id !== taskId)  })
    }

    const changeFilter = (todolistsID: string ,nextFilterValue: FilterValuesType) => {
        setTodolists(todolists.map(el=> el.id === todolistsID ? {...el, filter:nextFilterValue} : el))
    }

    const removeTodoList = (todolistsID: string) => {
        setTodolists(todolists.filter(f => f.id!==todolistsID))
        delete tasks[todolistsID]
    }

    return (
        <div className="App">
            {todolists.map( (el) => {
                let taskForTodolist = tasks[el.id];
                if (el.filter === "Active"){
                    taskForTodolist = tasks[el.id].filter(t => !t.isDone);
                }
                if (el.filter === "Completed"){
                    taskForTodolist = tasks[el.id].filter(t => t.isDone)
                }
                return(
                    <TodoList
                        key={el.id}
                        todolistsID={el.id}
                        title={el.title}
                        tasks={taskForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeTaskStatus}
                        filter={el.filter}
                        removeTodoList={removeTodoList}
                    />
                    )
            })
            }
        </div>
    );
}

export default App;
