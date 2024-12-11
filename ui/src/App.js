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

    const handleTaskMove = (taskId, sourceColumn, destinationColumn, newOrderIndex) => {
        const updatedBoard = { ...board };

        // Remove task from source column
        const taskIndex = updatedBoard[sourceColumn].findIndex((task) => task.id === taskId);
        const [movedTask] = updatedBoard[sourceColumn].splice(taskIndex, 1);

        // Insert task at new position in the destination column
        updatedBoard[destinationColumn].splice(newOrderIndex, 0, movedTask);

        setBoard(updatedBoard);
        socket.emit('task-update', updatedBoard);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex items-center m-4">
                <input
                    type="text"
                    maxLength={50}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description (max 50 chars)"
                    className="flex-1 p-2 border rounded"
                />
                <button
                    onClick={addTask}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Task
                </button>
            </div>
            <div className="flex flex-grow">
                {['todo', 'inProgress', 'done'].map((column) => (
                    <Column
                        key={column}
                        title={column}
                        tasks={board[column]}
                        onTaskMove={handleTaskMove}
                        onTaskDelete={deleteTask}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;