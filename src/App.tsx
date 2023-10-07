import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";


export type FilterValuesType = 'All' | 'Active' | 'Completed'


function App() {

    const todoListTitle_1: string = "What to learn"

    const [tasks_1, setTasks_1] = useState<Array<TaskType>>([
        {id: crypto.randomUUID(), isDone: true, title: 'HTML&CSS'},
        {id: crypto.randomUUID(), isDone: true, title: 'JS'},
        {id: crypto.randomUUID(), isDone: true, title: 'React'},
        {id: crypto.randomUUID(), isDone: false, title: 'TS'},
    ])

    const addTask = (title: string) => {
        const newTask: TaskType = {
            id: crypto.randomUUID(),
            title: title,
            isDone: false,
        }
        setTasks_1([newTask, ...tasks_1])
    }

    const changeTaskStatus = (taskId: string, newIsDoneValue: boolean) => {
        const updatedTask: Array<TaskType> = tasks_1.map( t => t.id === taskId
        ? {...t, isDone: newIsDoneValue}
            : t)
        setTasks_1(updatedTask)
    }


    const removeTask = (taskId: string) => {
        setTasks_1(tasks_1.filter(t => t.id !== taskId))
    }



    const [filter, setFilter]
        = useState<FilterValuesType>('All')
    const getFilterTaskForRender = (alltasks: Array<TaskType>, filterValue: FilterValuesType): Array<TaskType> => {
        switch (filterValue) {
            case "Active":
                return alltasks.filter(t => !t.isDone)
            case "Completed":
                return alltasks.filter(t => t.isDone)
            default:
                return alltasks
        }
    }

    const changeFilter = (nextFilterValue: FilterValuesType) => {
        setFilter(nextFilterValue)
    }

    const filterTaskForRender: Array<TaskType> = getFilterTaskForRender(tasks_1, filter)
    return (
        <div className="App">
            <TodoList
                title={todoListTitle_1}
                tasks={filterTaskForRender}
                removeTask={removeTask}
                changeFilter={changeFilter}
                addTask={addTask}
                changeTaskStatus={changeTaskStatus}
                filter={filter}
                />
        </div>
    );
}

export default App;
