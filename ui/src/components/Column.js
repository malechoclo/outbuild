export default function Column({
    title,
    tasks = [],
    highlightedTasks,
    onTaskMove,
    onTaskDelete,
    onTaskEdit,
    editingTask,
    editContent,
    setEditContent,
    saveTask,
}) {
    return (
        <div
            className="w-1/3 p-4 border border-gray-300 mx-3 overflow-y-auto h-full"
        >
            <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10 p-2 border-b">
                {title.toUpperCase()}
            </h2>
            <div>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`p-4 m-2 rounded bg-gray-800 hover:shadow cursor-grab ${
                            highlightedTasks[task.id] ? 'opacity-50' : ''
                        }`}
                    >
                        {editingTask === task.id ? (
                            <div className="mt-3">
                                {editContent.map(([key, value], index) => (
                                    <div key={index} className="mt-2">
                                        <label className="text-white text-sm">{`Edit ${key}`}</label>
                                        <input
                                            type={key === 'deadline' ? 'date' : 'text'}
                                            value={value}
                                            onChange={(e) => {
                                                const updated = [...editContent];
                                                updated[index][1] = e.target.value;
                                                setEditContent(updated);
                                            }}
                                            className="p-2 mt-1 w-full border rounded bg-white text-black"
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() =>
                                        saveTask(task.id, editContent)
                                    }
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-100 mt-3">{task.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}