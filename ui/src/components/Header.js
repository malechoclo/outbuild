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

            <div className='text-white flex flex-col m-auto text-4xl justify-start items-center '>
                <div className="flex flex-row items-center justify-start">
                    <span className='mr-5 ml-1'>Worky</span>
                    <span >
                        <svg className='h-16' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                            <path strokeLinecap="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                        </svg>
                    </span>
                </div>

            </div>

            <div className="flex w-4/5 flex-col justify-end">

                <div className="flex flex-row w-full">

                    <div className="flex-1 flex items-start flex-col  mr-3">
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
                    <div className="flex-1 flex items-start flex-col mr-4">
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
                    <div className="flex-1 flex items-start flex-col mr-4">
                        <label className={`mr-4 text-white ${errors.description ? 'text-red-300' : ''}`}>Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className={`h-10 p-2 w-full border rounded ${errors.deadline ? 'border-red-500 border-2 ' : ''}`}
                        />
                    </div>
                    <div className="flex-1 flex items-start flex-col">
                        <label className="mr-4 text-white">&nbsp;</label>
                        <button
                            onClick={addTask}
                            className="inline-block rounded bg-transparent px-6 py-2 text-1xl uppercase text-white border-solid border-2 border-white hover:bg-white hover:text-indigo-500 w-full "
                        >
                            Add Task
                        </button>
                    </div>
                </div>

                <span className='flex flex-row items-center justify-end text-1xl mt-1 w-full text-white  mt-4 pr-2'>
                    <span className="mr-0">Connected</span>
                    <span className={`flex rounded-full border-solid justify-start items-center`}>
                        <svg className={`size-6 ${updateClientCount ? 'animate-ping' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-width="2.4" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </span>
                    <span>:</span>
                    <div className="user-counter text-2xl ml-3">{clientCount}</div>
                </span>

            </div>



        </div>
    );
}

export default Header;