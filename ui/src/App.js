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
    const [editingTask, setEditingTask] = useState(null); // Track the task being edited
    const [editContent, setEditContent] = useState(''); // Track the content of the task being edited


    useEffect(() => {
        socket.on('update-board', (newBoard) => setBoard(newBoard));

        return () => {
            socket.disconnect();
        };
    }, []);

    const addTask = () => {
        if (!description.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            content: description,
            createdAt: new Date().toLocaleString(),
        };

        const updatedBoard = { ...board, todo: [...board.todo, newTask] };
        setBoard(updatedBoard);
        setDescription('');
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

    const editTask = (taskId, content) => {
        setEditingTask(taskId); // Set the task ID to edit
        setEditContent(content); // Initialize the input field with the current content
    };

    const saveTask = (taskId, newContent) => {
        const updatedBoard = { ...board };

        // Update the task content
        Object.keys(updatedBoard).forEach((column) => {
            updatedBoard[column] = updatedBoard[column].map((task) =>
                task.id === taskId ? { ...task, content: newContent } : task
            );
        });

        setBoard(updatedBoard); // Update the state
        setEditingTask(null); // Reset the editing state
        setEditContent(''); // Clear the input field
        socket.emit('task-update', updatedBoard); // Notify the server
    };

    const handleTaskMove = (taskId, sourceColumn, destinationColumn, newOrderIndex) => {
        const updatedBoard = { ...board };

        // Find the task and its index in the source column
        const taskIndex = updatedBoard[sourceColumn].findIndex((task) => task.id === taskId);
        const [movedTask] = updatedBoard[sourceColumn].splice(taskIndex, 1);

        // Move the task to the destination column
        updatedBoard[destinationColumn].splice(newOrderIndex, 0, movedTask);

        setBoard(updatedBoard); // Update the board state
        socket.emit('task-update', updatedBoard); // Notify the server
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-cyan-700 to-blue-700 pb-2 px-1">
            <div className="flex items-center m-4">
                <input
                    type="text"
                    maxLength={50}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description (max 50 chars)"
                    className="mr-5 p-2 w-1/4 border rounded py-3"
                />
                <button
                    onClick={addTask}
                    className=" px-4 py-3 bg-gray-200 text-black rounded hover:bg-gray-00"
                >
                    Add Task
                </button>
            </div>
            <div className="flex flex-grow overflow-hidden">
                {['todo', 'inProgress', 'done'].map((column) => (
                    <Column
                        key={column}
                        title={column}
                        tasks={board[column]}
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