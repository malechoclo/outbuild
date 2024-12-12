import React, { useState, useEffect } from 'react';
import socket from './utils/socket';
import Column from './components/Column';
import Header from './components/Header';


const initialBoard = {
    todo: [],
    inProgress: [],
    done: [],
};

function App() {
    const [board, setBoard] = useState(initialBoard);
    const [editingTasks, setEditingTasks] = useState({}); // Estado para tareas en edición
    const [description, setDescription] = useState('');
    const [taskUrgency, setTaskUrgency] = useState(''); // Renamed from `urgency` to `taskUrgency`
    const [deadline, setDeadline] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editDeadline, setEditDeadline] = useState('');
    const [editUrgency, setEditUrgency] = useState(''); // Renamed for editing state
    const [errors, setErrors] = useState({});
    const [clientCount, setClientCount] = useState(0); // State for client count
    const [updateClientCount, setUpdateClientCount] = useState(false); // State for client count
    const [highlightedTasks, setHighlightedTasks] = useState({});

    useEffect(() => {
        socket.on('update-board', (newBoard) => setBoard(newBoard));
        socket.on('task-editing', (editingTasks) => setEditingTasks(editingTasks));

        return () => {
            socket.disconnect();
        };
    }, []);
    const handleInteractionStart = (taskId) => {
        console.log("handleInteractionEnd", socket)
        socket.emit('interact-task', { taskId });
    };

    const handleInteractionEnd = (taskId) => {
        console.log("handleInteractionEnd", socket)
        socket.emit('stop-interact-task', { taskId });
    };
    const notifyEditingTask = (taskId, isEditing) => {
        const updatedEditingTasks = { ...editingTasks, [taskId]: isEditing ? socket.id : null };
        setEditingTasks(updatedEditingTasks);
        socket.emit('task-editing', updatedEditingTasks);
    };

    const handleTaskMove = (taskId, sourceColumn, destinationColumn, newOrderIndex) => {
        notifyEditingTask(taskId, false); // Notificar que el task ya no está siendo editado
        const updatedBoard = { ...board };

        // Mover el task a otra columna
        const taskIndex = updatedBoard[sourceColumn].findIndex((task) => task.id === taskId);
        const [movedTask] = updatedBoard[sourceColumn].splice(taskIndex, 1);
        updatedBoard[destinationColumn].splice(newOrderIndex, 0, movedTask);

        setBoard(updatedBoard);
        socket.emit('task-update', updatedBoard);
    };
    const addTask = () => {
        if (!validateFields()) return;

        const newTask = {
            id: Date.now().toString(),
            content: description,
            urgency: taskUrgency,
            deadline,
            createdAt: new Date().toLocaleString(),
        };

        const updatedBoard = Object.assign({}, board);
        updatedBoard.todo = board.todo.concat(newTask);
        setBoard(updatedBoard);

        // Clear inputs
        setDescription('');
        setTaskUrgency('');
        setDeadline('');
        setErrors({});

        socket.emit('task-update', updatedBoard);
    };
    const deleteTask = (taskId) => {
        const updatedBoard = { ...board };

        // Iterate over each column and remove the task
        Object.keys(updatedBoard).forEach((column) => {
            updatedBoard[column] = updatedBoard[column].filter((task) => task.id !== taskId);
        });

        setBoard(updatedBoard); // Update the state
        socket.emit('task-update', updatedBoard); // Notify other clients
    };
    const editTask = (taskId, task) => {
        setEditingTask(taskId);
        setEditContent(task.content);
        setEditDeadline(task.deadline);
        setEditUrgency(task.urgency); // Use the renamed setter for editing state
    };
    const saveTask = (taskId, newContent, newUrgency, newDeadline) => {
        const updatedBoard = { ...board };

        Object.keys(updatedBoard).forEach((column) => {
            updatedBoard[column] = updatedBoard[column].map((task) =>
                task.id === taskId
                    ? { ...task, content: newContent, urgency: newUrgency, deadline: newDeadline }
                    : task
            );
        });

        setBoard(updatedBoard);
        setEditingTask(null);
        setEditContent('');
        setEditDeadline('');
        setEditUrgency('');
        socket.emit('task-update', updatedBoard);
    };
    const validateFields = () => {
        const fieldErrors = {};
        if (!description.trim()) fieldErrors.description = true;
        if (!taskUrgency) fieldErrors.taskUrgency = true;
        if (!deadline) fieldErrors.deadline = true;
        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };
    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-indigo-600 to-indigo-700 pb-2 px-1">
            <Header
                errors={errors}
                addTask={addTask}
                deadline={deadline}
                setDeadline={setDeadline}
                taskUrgency={taskUrgency}
                setTaskUrgency={setTaskUrgency}
                setDescription={setDescription}
                description={description}
                updateClientCount={updateClientCount}
                clientCount={clientCount}
            />

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
                    editDeadline={editDeadline}
                    setEditDeadline={setEditDeadline}
                    editUrgency={editUrgency}
                    setUrgency={setEditUrgency}
                    saveTask={saveTask}
                    onTaskInteractionStart={handleInteractionStart} // Notify interaction start
                    onTaskInteractionEnd={handleInteractionEnd} // Notify interaction end
                    highlightedTasks={highlightedTasks}
                    setEditingTasks={setEditingTasks}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;