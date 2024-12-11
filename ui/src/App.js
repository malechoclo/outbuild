import React, { useState, useEffect } from 'react';
import socket from './utils/socket';
import Column from './components/Column';

const initialBoard = {
    todo: [],
    inProgress: [],
    done: [],
};

function App() {
    const [board, setBoard] = useState(initialBoard);
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('low');
    const [deadline, setDeadline] = useState(''); // Track the deadline for the task
    const [editingTask, setEditingTask] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [highlightedTasks, setHighlightedTasks] = useState({}); // Track interacting tasks
    // Convert an object to an array of key-value pairs
    const objectToArray = (obj) => Object.entries(obj);
    // Convert an array of key-value pairs back to an object
    const arrayToObject = (arr) => Object.fromEntries(arr);
    
    useEffect(() => {
        socket.on('update-board', (newBoard) => setBoard(newBoard));
        socket.on('highlight-task', (activeTasks) => setHighlightedTasks(activeTasks));

        return () => {
            socket.disconnect();
        };
    }, []);

    const addTask = () => {
        if (!description.trim() || !deadline) return;

        const newTask = {
            id: Date.now().toString(),
            content: description,
            createdAt: new Date().toLocaleString(),
            urgency,
            deadline,
        };

        const updatedBoard = { ...board, todo: [...board.todo, newTask] };
        setBoard(updatedBoard);
        setDescription('');
        setDeadline('');
        socket.emit('task-update', updatedBoard);
    };

    const deleteTask = (taskId) => {
        const updatedBoard = { ...board };

        Object.keys(updatedBoard).forEach((column) => {
            updatedBoard[column] = updatedBoard[column].filter((task) => task.id !== taskId);
        });

        setBoard(updatedBoard);
        socket.emit('task-update', updatedBoard);
    };
    const editTask = (taskId, task) => {
        setEditingTask(taskId);
        setEditContent(objectToArray({
            content: task.content,
            urgency: task.urgency,
            deadline: task.deadline
        }));
    };

    const saveTask = (taskId, editArray) => {
        const updatedTask = arrayToObject(editArray);
        const updatedBoard = { ...board };

        // Update the task in the correct column
        Object.keys(updatedBoard).forEach((column) => {
            updatedBoard[column] = updatedBoard[column].map((task) =>
                task.id === taskId
                    ? { ...task, ...updatedTask }
                    : task
            );
        });

        setBoard(updatedBoard);
        setEditingTask(null);
        setEditContent(null);
        socket.emit('task-update', updatedBoard);
    };

    const handleTaskMove = (taskId, sourceColumn, destinationColumn, newOrderIndex) => {
        const updatedBoard = { ...board };
        const taskIndex = updatedBoard[sourceColumn].findIndex((task) => task.id === taskId);
        const [movedTask] = updatedBoard[sourceColumn].splice(taskIndex, 1);

        updatedBoard[destinationColumn].splice(newOrderIndex, 0, movedTask);
        setBoard(updatedBoard);
        socket.emit('task-update', updatedBoard);
        notifyInteraction(taskId);
    };

    const notifyInteraction = (taskId) => {
        socket.emit('interact-task', { taskId });
    };

    const stopInteraction = (taskId) => {
        socket.emit('stop-interact-task', { taskId });
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-cyan-600 to-cyan-700 pb-2 px-1">
            <div className="flex items-center m-4 bg-cyan-800 p-4">
                <div className="flex flex-col mr-1 w-1/2">
                    <label htmlFor="urgency" className="text-white text-sm mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        maxLength={50}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task description (max 50 chars)"
                        className="mr-5 p-2 w-100 border rounded"
                    />
                </div>
                <div className="flex flex-col mr-5">
                    <label htmlFor="urgency" className="text-white text-sm mb-1">
                        Urgency
                    </label>
                    <select
                        id="urgency"
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="p-2 border rounded bg-white text-black"
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="deadline" className="text-white text-sm mb-1">
                        Deadline
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="p-2 border rounded bg-white text-black"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="deadline" className="text-white text-sm mb-1">
                        &nbsp;
                    </label>
                    <button
                        onClick={addTask}
                        className="ml-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                    >
                        Add Task
                    </button>
                </div>

            </div>
            <div className="flex flex-grow overflow-hidden">
                {['todo', 'inProgress', 'done'].map((column) => (
                    <Column
                        key={column}
                        title={column}
                        tasks={board[column]}
                        highlightedTasks={highlightedTasks}
                        onTaskMove={handleTaskMove}
                        onTaskDelete={deleteTask}
                        onTaskEdit={editTask}
                        editingTask={editingTask}
                        editContent={editContent}
                        setEditContent={setEditContent}
                        saveTask={saveTask}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;