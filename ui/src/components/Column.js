import { useState } from "react";

export default function Column({
    title,
    tasks,
    onTaskMove,
    onTaskDelete,
    onTaskEdit,
    editingTask,
    editContent,
    setEditContent,
    editDeadline,
    setEditDeadline,
    editUrgency,
    setUrgency,
    saveTask,
    onTaskInteractionStart,
    onTaskInteractionEnd,
    highlightedTasks,
    socket
}) {
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.setData('sourceColumn', title);
        onTaskInteractionStart(taskId);
    };
    const [isDeleting, setIsDeleting] = useState(null)
    const handleDragOver = (e) => e.preventDefault();
    const handleDelete = (id) => {
        setIsDeleting(id)
        setTimeout(() => {
            onTaskDelete(id);
        }, 500);
    }
    const handleDrop = (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');
        const destinationColumn = title;

        if (sourceColumn !== destinationColumn) {
            onTaskMove(taskId, sourceColumn, destinationColumn, tasks.length);
        }
        onTaskInteractionEnd(taskId);
    };

    const getUrgencyColor = (urgency) => {
        if (urgency === 'high') return 'bg-red-500';
        if (urgency === 'medium') return 'bg-orange-300';
        return 'bg-green-500';
    };

    const getTaskClass = (taskId) => {
        return highlightedTasks[taskId] && highlightedTasks[taskId] !== socket.id
            ? 'opacity-30 editing'
            : 'bg-gray-800 opacity-100';
    };

    const handleEditStart = (id, task) => {
        onTaskEdit(id, task);
        onTaskInteractionStart(id);
    };

    const handleSaveTask = (taskId, newContent, newUrgency, newDeadline) => {
        saveTask(taskId, newContent, newUrgency, newDeadline);
        onTaskInteractionEnd(taskId);
    };


    return (
        <div
            className="w-1/3 p-6 pt-0 border border-transparent mx-1 overflow-y-auto h-full bg-black rounded-2xl "
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <h2 className="text-xl font-bold sticky top-0 bg-black z-10 p-4 bg-black text-white">
                {title.toUpperCase()}
            </h2>
            <div>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={() => onTaskInteractionEnd(task.id)}
                        className={`p-4 m-2 rounded bg-gray-800 cursor-grab opacity-80 hover:opacity-100 ${getTaskClass(task.id)} ${isDeleting === task.id ? 'animate-ping' : ''}`}
                    >

                        <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${getUrgencyColor(task.urgency)}`} />
                                <small className="text-white">{task.deadline}</small>
                            </div>
                            {
                                !getTaskClass(task.id)?.includes('editing') ? <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEditStart(task.id, task)}
                                        className="text-blue-300 hover:text-blue-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>

                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="text-red-300 hover:text-red-500 flex flex-row items-center "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div> : <></>
                            }

                        </div>

                        <div className="text-white">{task.content}</div>
                        <div className="text-gray-400 text-sm">Created: {task.createdAt}</div>

                        {editingTask === task.id && (
                            <div className="mt-3">
                                {/* Edit Content */}
                                <label className="text-white text-sm">Edit Content</label>
                                <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="p-2 mt-1 w-full border rounded"
                                />

                                {/* Edit Urgency */}
                                <label className="text-white text-sm mt-3">Edit Urgency</label>
                                <select
                                    value={editUrgency}
                                    onChange={(e) => setUrgency(e.target.value)}
                                    className="p-2 mt-1 w-full border rounded bg-white text-black"
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>

                                {/* Edit Deadline */}
                                <label className="text-white text-sm mt-3">Edit Deadline</label>
                                <input
                                    type="date"
                                    value={editDeadline}
                                    onChange={(e) => setEditDeadline(e.target.value)}
                                    className="p-2 mt-1 w-full border rounded bg-white text-black"
                                />

                                {/* Save Button */}
                                <button
                                    onClick={() => handleSaveTask(task.id, editContent, editUrgency, editDeadline)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >

                                    Save
                                </button>
                            </div>
                        )}
                    </div>

                ))}
            </div>
        </div>
    );
}