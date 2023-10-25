import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    onChange: (newValue: string) => void
}

export function EditableSpan(props: EditableSpanPropsType) {
    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState("")

    const ActiveMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }

    const ViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }

    const onChangeTitleTask = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField value={title} onBlur={ViewMode} autoFocus onChange={onChangeTitleTask}/>
        : <span onDoubleClick={ActiveMode}>{props.title}</span>

}