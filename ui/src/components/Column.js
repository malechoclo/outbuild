import React from 'react';

export default function Column({ title, tasks = [], onTaskMove, onTaskDelete }) {
    const handleDragOver = (e) => {
        e.preventDefault(); // Allow the drop event
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');
        const destinationColumn = title;
        const newOrderIndex = parseInt(e.target.getAttribute('data-index')) || tasks.length;
        onTaskMove(taskId, sourceColumn, destinationColumn, newOrderIndex);
    };

    return (
        <div
            className="w-1/3 p-4 border border-gray-300"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div>
                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        draggable
                        data-index={index}
                        onDragStart={(e) => {
                            e.dataTransfer.setData('taskId', task.id);
                            e.dataTransfer.setData('sourceColumn', title);
                        }}
                        className="p-2 mt-2 rounded bg-gray-200 hover:bg-gray-300 cursor-grab"
                    >
                        <div>{task.content}</div>
                        <small className="text-gray-500">{task.createdAt}</small>
                        <button
                            onClick={() => onTaskDelete(task.id)}
                            className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}