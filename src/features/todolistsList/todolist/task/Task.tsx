import React, {ChangeEvent, memo} from 'react';
import {Checkbox, IconButton, ListItem, Paper} from "@mui/material";
import {EditableSpan} from "../../../../components/editableSpan/EditableSpan";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";

type TaskPropsType = {
    tasks: TaskType
    removeTask: (todolistsID: string, taskId: string) => void
    changeTaskStatus: (todolistsID: string, taskId: string, status: TaskStatuses) => void
    changeTaskTitle: (todolistsID: string, taskId: string, value: string) => void
    todolistsId: string
}
export const Task = memo((props: TaskPropsType) => {
    const onClickRemoveTaskHandler = () => {
        props.removeTask(props.todolistsId, props.tasks.id)
    }

    const onChangeTaskStatusHandler =
        (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(props.todolistsId, props.tasks.id, e.currentTarget.checked ? TaskStatuses.Complited : TaskStatuses.New)
        }

    const onChangeTaskTitleHandler = (newValue: string) => {
        props.changeTaskTitle(props.todolistsId, props.tasks.id, newValue)
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
                    checked={props.tasks.status === TaskStatuses.Complited}
                />
                <span className={props.tasks.status === TaskStatuses.Complited ? "task-done" : "task"}>
                    <EditableSpan title={props.tasks.title} onChange={onChangeTaskTitleHandler}/>
                </span>
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={onClickRemoveTaskHandler}
                        size="small" color="primary"
                        disabled={props.tasks.entityStatus === 'loading'}
                         >
                        <HighlightOffIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    )
});

export default Task;