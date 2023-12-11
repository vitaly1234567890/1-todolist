import type {Meta, StoryObj} from '@storybook/react';
import Task from "../Task";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
    title: 'TODOLIST/Task',
    component: Task,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        changeTaskStatus: {
            description: "Change task status",
            action: 'clicked'
        },
        changeTaskTitle: {
            description: "Change task title",
            action: 'clicked'
        },
        removeTask: {
            description: "Delete task",
            action: 'clicked'
        },
    },
    args: {
        tasks: {id: 'ddd', status: TaskStatuses.Complited, title: "JS", todoListId: 'todolistId1',
            startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true},
        todolistsId: 'dssffds'
    }
};

export default meta;
type Story = StoryObj<typeof Task>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const TaskIsDoneStory: Story = {};
export const TaskIsNotDoneStory: Story = {
    args: {
        tasks: {id: 'ddd', status: TaskStatuses.New, title: "CSS & HTML", todoListId: 'todolistId1',
            startDate: "", deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '', completed: true},
        todolistsId: 'dssffds'
    }
};

