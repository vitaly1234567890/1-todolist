import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton, ListItem, Paper} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {TaskType} from "./TodoList";

type TaskPropsType = {
    tasks: TaskType
    removeTask: (todolistsID: string, taskId: string) => void
    changeTaskStatus: (todolistsID: string, taskId: string, newIsDoneValue: boolean) => void
    changeTaskTitle: (todolistsID: string, taskId: string, value: string) => void
    todolistsID: string
}
export const Task = memo((props: TaskPropsType) => {
    const onClickRemoveTaskHandler = () => {
        props.removeTask(props.todolistsID, props.tasks.id)
    }

    const onChangeTaskStatusHandler =
        (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.todolistsID, props.tasks.id, e.currentTarget.checked)
        }

    const onChangeTaskTitleHandler = (newValue: string) => {
        props.changeTaskTitle(props.todolistsID, props.tasks.id, newValue)
    }

    return (
        <Paper sx={{m: "10px"}}
               elevation={5}
        >
            <ListItem
                sx={{p: "0"}}
            >
                <Checkbox
                    onChange={onChangeTaskStatusHandler}
                    checked={props.tasks.isDone}
                />
                <span className={props.tasks.isDone ? "task-done" : "task"}>
                    <EditableSpan title={props.tasks.title} onChange={onChangeTaskTitleHandler}/>
                </span>
                <ListItemSecondaryAction>
                    <IconButton onClick={onClickRemoveTaskHandler} size="small" color="primary">
                        <HighlightOffIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    )
});

export default Task;