import { useState } from "react";
/**
 * Column component to render tasks within a specific column.
 * @param {Object} props - Props for the component.
 * @param {string} props.title - Title of the column (e.g., "todo", "inProgress").
 * @param {Array} props.tasks - List of tasks in the column.
 * @param {Function} props.onTaskMove - Callback to handle task movement between columns.
 * @param {Function} props.onTaskDelete - Callback to delete a task.
 * @param {Function} props.onTaskEdit - Callback to edit a task.
 * @param {string|null} props.editingTask - ID of the currently editing task, if any.
 * @param {string} props.editContent - Current content of the task being edited.
 * @param {Function} props.setEditContent - Function to update the task content during editing.
 * @param {string} props.editDeadline - Current deadline of the task being edited.
 * @param {Function} props.setEditDeadline - Function to update the task deadline during editing.
 * @param {string} props.editUrgency - Current urgency level of the task being edited.
 * @param {Function} props.setUrgency - Function to update the task urgency during editing.
 * @param {Function} props.saveTask - Callback to save the edited task.
 * @param {Function} props.onTaskInteractionStart - Callback to signal task interaction start.
 * @param {Function} props.onTaskInteractionEnd - Callback to signal task interaction end.
 * @param {Object} props.highlightedTasks - Map of tasks being interacted with by other users.
 * @param {Object} props.socket - Socket instance for real-time communication.
 */
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
    const [isDeleting, setIsDeleting] = useState(null);
    /**
 * Handles the drag start event for a task.
 * @param {Event} e - The drag event.
 * @param {string} taskId - ID of the dragged task.
 */
    const handleDragStart = (e, taskId) => {
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.setData('sourceColumn', title);
        onTaskInteractionStart(taskId);
    };
    /**
     * Prevents the default behavior when dragging over a column.
     * @param {Event} e - The drag over event.
     */
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    /**
     * Handles the drop event to move a task between columns.
     * @param {Event} e - The drop event.
     */
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
    /**
     * Deletes a task after a delay.
     * @param {string} id - ID of the task to delete.
     */
    const handleDelete = (id) => {
        setIsDeleting(id)
        setTimeout(() => {
            onTaskDelete(id);
        }, 500);
    }
    /**
     * Determines if a task is being edited by another user.
     * @param {string} taskId - ID of the task to check.
     * @returns {boolean} True if the task is being edited by another user.
     */
    const isEditingTasks = (taskId) => {
        return highlightedTasks[taskId] && highlightedTasks[taskId] !== socket.id
    }
    /**
     * Starts editing a task and signals interaction start.
     * @param {string} id - ID of the task to edit.
     * @param {Object} task - The task object to edit.
     */
    const handleEditStart = (id, task) => {
        onTaskEdit(id, task);
        onTaskInteractionStart(id);
    };
    /**
     * Returns the CSS class for a task's urgency.
     * @param {string} urgency - Urgency level of the task ("high", "medium", "low").
     * @returns {string} CSS class for the urgency.
     */
    const getUrgencyColor = (urgency) => {
        if (urgency === 'high') return 'bg-red-500';
        if (urgency === 'medium') return 'bg-orange-300';
        return 'bg-green-500';
    };
    /**
     * Returns the CSS class for a task based on its interaction state.
     * @param {string} taskId - ID of the task.
     * @returns {string} CSS class for the task.
     */
    const getTaskClass = (taskId) => {
        return isEditingTasks(taskId)
            ? 'opacity-60 editing cursor-no-drop'
            : 'opacity-100 hover:opacity-100 hover:shadow-indigo-900 hover:shadow-lg hover:scale-100 transition duration-50 ease-in-out';
    };

    /**
     * Saves the edited task and signals interaction end.
     * @param {string} taskId - ID of the task to save.
     * @param {string} newContent - Updated content for the task.
     * @param {string} newUrgency - Updated urgency level for the task.
     * @param {string} newDeadline - Updated deadline for the task.
     */
    const handleSaveTask = (taskId, newContent, newUrgency, newDeadline) => {
        saveTask(taskId, newContent, newUrgency, newDeadline);
        onTaskInteractionEnd(taskId);
    };
    /**
     * Formats the column title for display.
     * @param {string} title - Column title (e.g., "todo").
     * @returns {string} Formatted column title.
     */
    const formatTitle = (title) => {
        return title.toUpperCase().replace('TO', 'TO ').replace('IN', 'IN ')
    }

    return (
        <div
            className={`w-1/3 p-1 pt-0 border border-transparent mx-1 overflow-y-auto h-full bg-indigo-500 rounded-2xl `}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <h2 className="text-xl font-bold sticky top-0  bg-indigo-500 z-10 p-4 bg-black text-gray-300">
                {formatTitle(title)}
            </h2>
            <div>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        draggable={!getTaskClass(task.id).includes("editing")}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-4 m-2 rounded-2xl bg-indigo-900 cursor-grab opacity-90 scale-95 ${getTaskClass(task.id)} ${isDeleting === task.id ? 'animate-ping' : ''}`}
                    >
                        <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${getUrgencyColor(task.urgency)}`} />
                                <small className="text-white">{task.deadline}</small>
                            </div>
                            {
                                !getTaskClass(task.id)?.includes('editing') ? <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        data-testid="edit-task-btn"
                                        onClick={() => handleEditStart(task.id, task)}
                                        className="text-blue-300 hover:text-blue-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>

                                    </button>
                                    <button
                                        type="button"
                                        data-testid="delete-task-btn"
                                        onClick={() => handleDelete(task.id)}
                                        className="text-red-300 hover:text-red-500 flex flex-row items-center "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div> : <></>
                            }

                        </div>

                        <div className="text-white">{task.content}</div>
                        <div className="text-gray-400 text-sm">Created: {task.createdAt}</div>

                        {editingTask === task.id && (
                            <form data-testid="edit-form" className="mt-3">
                                {/* Edit Content */}
                                <label htmlFor="edit-content" className="text-white text-sm">Edit Content</label>
                                <input
                                    id="edit-content"
                                    data-testid="edit-content"
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="p-2 mt-1 w-full border rounded"
                                />

                                {/* Edit Urgency */}
                                <label htmlFor="edit-urgency" className="text-white text-sm mt-3">Edit Urgency</label>
                                <select
                                    id="edit-urgency"
                                    data-testid="edit-urgency"
                                    value={editUrgency}
                                    onChange={(e) => setUrgency(e.target.value)}
                                    className="p-2 mt-1 w-full border rounded bg-white text-black"
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>

                                {/* Edit Deadline */}
                                <label htmlFor="edit-dead-line" className="text-white text-sm mt-3">Edit Deadline</label>
                                <input
                                    id="edit-dead-line"
                                    data-testid="edit-dead-line"
                                    type="date"
                                    value={editDeadline}
                                    onChange={(e) => setEditDeadline(e.target.value)}
                                    className="p-2 mt-1 w-full border rounded bg-white text-black"
                                />

                                {/* Save Button */}
                                <button
                                    type="button"
                                    data-testid="edit-save-button"
                                    onClick={() => handleSaveTask(task.id, editContent, editUrgency, editDeadline)}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >

                                    Save
                                </button>
                            </form>
                        )}
                    </div>

                ))}
            </div>
        </div >
    );
}