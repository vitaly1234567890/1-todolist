import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";


export type FilterValuesType = 'All'|'Active'|'Completed'


function App() {

    const todoListTitle_1: string = "What to learn"

    const [tasks_1, setTasks_1] = useState<Array<TaskType>>([
        {id: 1, isDone: true, title: 'HTML&CSS'},
        {id: 2, isDone: true, title: 'JS'},
        {id: 3, isDone: false, title: 'React'},
        {id: 4, isDone: true, title: 'TS'},
    ])

    const removeTask = (taskId: number) => {
        const nextState: Array<TaskType> = []
        for (let i=0; i < tasks_1.length; i++) {
            if(tasks_1[i].id !== taskId) {
                nextState.push(tasks_1[i])
            }
        }
        setTasks_1(nextState)
    }

    const [filter, setFilter]
        = useState<FilterValuesType>('All')
    const getFilterTaskForRender = (alltasks: Array<TaskType>, filterValue: FilterValuesType): Array<TaskType> => {
        let result: Array<TaskType> = alltasks
        switch (filterValue) {
            case "Active":
                return result.filter(t => !t.isDone)
            case "Completed":
                return result.filter(t => t.isDone)
            default:
                return result
        }
    }

    const changeFilter = (nextFilterValue: FilterValuesType) => {
        setFilter(nextFilterValue)
    }

    const filterTaskForRender: Array<TaskType> = getFilterTaskForRender(tasks_1, filter)
    return (
        <div className="App">
            <TodoList title={todoListTitle_1}
                      tasks={filterTaskForRender}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
            />

        </div>
    );
}

export default App;
