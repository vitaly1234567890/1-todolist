import React, {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = memo ((props: AddItemFormPropsType) => {
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
            props.addItem(trimmedTitle)
        } else {
            setInputError(true)
        }
        setNewTaskTitle("")
    }

    const userMessage = inputError
        ? <span style={{color: "red"}}> Your title is too empty</span>
        : newTaskTitle.length < 15
            ? <span>Enter new title</span>
            : <span style={{color: "red"}}> Your title is too long</span>


    const isAddBtnDisabled = !newTaskTitle || newTaskTitle.length >= 15

    return <div>
        <TextField
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