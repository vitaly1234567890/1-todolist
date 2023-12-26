import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = memo (({addItem, disabled = false}: AddItemFormPropsType) => {
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [inputError, setInputError] = useState(false)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
        inputError && setInputError(false)
    }

    const onKeyDownAddTask = (event: KeyboardEvent<HTMLInputElement>) => {
        event.key === 'enter' && onClickAddTask()
    }

    const onClickAddTask = () => {
        const trimmedTitle = newTaskTitle.trim()
        if (trimmedTitle) {
            addItem(trimmedTitle)
        } else {
            setInputError(true)
        }
        setNewTaskTitle("")
    }

    const userMessage = inputError
        ? <span style={{color: "red"}}> Your title is too empty</span>
            : <span>Enter new title</span>

    const isAddBtnDisabled = !newTaskTitle || disabled

    return <div>
        <TextField
            disabled={disabled}
            size='small'
            value={newTaskTitle}
            onChange={onChangeHandler}
            onKeyDown={onKeyDownAddTask}
            error={inputError}
            helperText={inputError && userMessage}
        />
        <IconButton onClick={onClickAddTask} disabled={isAddBtnDisabled} size="small" color="primary">
            <PostAddIcon/>
        </IconButton>
        <div>
            {userMessage}
        </div>
    </div>

})