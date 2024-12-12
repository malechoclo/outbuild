const Header = ({ errors,
    addTask,
    deadline,
    setDeadline,
    taskUrgency,
    setTaskUrgency,
    setDescription,
    description,
    updateClientCount,
    clientCount }) => {
    return (
        <div className="flex flex-row mx-1 my-5 bg-none p-4 w-full">
            <div className="w-3/4 flex flex-row">
                <div className="flex items-start flex-col w-1/4 mr-4">
                    <label
                        className={`mr-4 text-white ${errors.description ? 'text-red-300' : ''}`}

                    >Description</label>
                    <input
                        type="text"
                        maxLength={50}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Task description (max 50 chars)"
                        className={`p-2 w-full h-10 border rounded ${errors.description ? 'border-red-500 border-2 ' : ''}`}
                    />
                </div>
                <div className="flex items-start flex-col mr-4">
                    <label className={`mr-4 text-white ${errors.description ? 'text-red-300' : ''}`}>Urgency</label>
                    <select
                        value={taskUrgency}
                        onChange={(e) => setTaskUrgency(e.target.value)} // Updated with `taskUrgency`
                        className={`h-10 p-2 w-full border rounded ${errors.taskUrgency ? 'border-red-500 border-2 ' : ''}`}
                    >
                        <option value="">Select urgency</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="flex items-start flex-col mr-4">
                    <label className={`mr-4 text-white ${errors.description ? 'text-red-300' : ''}`}>Deadline</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={`h-10 p-2 w-full border rounded ${errors.deadline ? 'border-red-500 border-2 ' : ''}`}
                    />
                </div>
                <div className="flex items-start flex-col">
                    <label className="mr-4 text-white">&nbsp;</label>
                    <button
                        onClick={addTask}
                        className="inline-block rounded bg-transparent px-6 pb-2 pt-2.5 text-1xl  uppercase  text-white border-solid border-1 border-white animate-pulse"
                    >
                        Add Task
                    </button>
                </div>
            </div>


            <div className='w-1/4 text-white flex flex-row m-auto text-4xl  justify-end items-center mr-5'>
                <span className='flex justify-end items-center mr-10'>
                    <span className={`flex rounded-full border-solid justify-end items-center mr-2 `}>
                        <svg className={`size-6 ${updateClientCount ? 'animate-ping' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                    </span>
                    <div className="user-counter text-2xl">{clientCount}</div>
                </span>

                <span className='mr-5 '>Worky</span>
                <span >
                    <svg className='h-16 w-16"' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                        <path strokeLinecap="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                </span>

            </div>
        </div>
    );
}

export default Header;