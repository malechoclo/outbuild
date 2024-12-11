import React from 'react';

export default function Column({ title, tasks = [], onTaskMove, onTaskDelete, onTaskEdit, editingTask, editContent, setEditContent, saveTask }) {
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.setData('sourceColumn', title);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow the drop event
    };


    const handleDrop = (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');
        const destinationColumn = title;

        if (sourceColumn !== destinationColumn) {
            onTaskMove(taskId, sourceColumn, destinationColumn, tasks.length); // Append the task to the end
        }
    };

    return (
        <>
            <div
                className="w-1/3 mx-1 overflow-y-auto h-full bg-black rounded-2xl"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <h2 className="bg-black text-xl text-white  sticky top-0  z-10  pt-4 pl-5  w-100 h-16">
                    {title.toUpperCase()}
                </h2>
                <div>
                    {tasks.map((task, index) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="p-4 m-2 rounded bg-gray-800 hover:shadow cursor-grab"
                        >
                            <div>
                                <div className="flex justify-between items-center">
                                    <small className="text-white">{task.createdAt}</small>
                                    <div className="action">
                                        <button
                                            onClick={() => onTaskEdit(task.id, task.content)} // Start editing
                                            className="mt-2 px-2 text-blue-300 rounded hover:text-blue-500"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button
                                            onClick={() => onTaskDelete(task.id)} // Delete task
                                            className="mt-2 px-2 text-red-300 rounded hover:text-red-500"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                {/* Display task content or edit input */}
                                {editingTask === task.id ? (
                                    <input
                                        type="text"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                saveTask(task.id, editContent); // Save on Enter
                                            }
                                        }}
                                        className="mt-2 p-2 w-full border rounded"
                                    />
                                ) : (
                                    <p className='text-gray-100'>{task.content}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div></>
    );
}