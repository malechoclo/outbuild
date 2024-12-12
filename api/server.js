const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
/**
 * Initializes the server and sets up Socket.IO for real-time communication.
 */
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS']
    },
});

let board = {
    todo: [],
    inProgress: [],
    done: [],
};
let activeTasks = {};

let connectedClients = 0;
/**
 * Handles a new client connection and sets up event listeners.
 * @param {Object} socket - Socket instance for the connected client.
 */
io.on('connection', (socket) => {
    connectedClients++;
    io.emit('client-count', connectedClients); // Notify all clients about the new count
    /**
     * Handles board update
     * @param {Object} board 
     */
    socket.emit('update-board', board);
    /**
       * Handles notifies you which task is being edited
       * @param {Object} board 
       */
    socket.emit('highlight-task', activeTasks);

    /**
     * Updates the board when a task is edited and notifies other clients.
     * @param {Object} newBoard - Updated board object.
     */
    socket.on('task-update', (newBoard) => {
        board = newBoard;
        socket.broadcast.emit('update-board', board);
    });

    /**
 * Handles user interaction with a task.
 * @param {Object} taskId - ID of the task being interacted with.
 */
    socket.on('interact-task', ({ taskId }) => {
        activeTasks[taskId] = socket.id;
        io.emit('highlight-task', activeTasks);
    });
    /**
 * Handles user interaction stop
 * @param {Object} taskId - ID of the task being interacted with.
 */
    socket.on('stop-interact-task', ({ taskId }) => {
        delete activeTasks[taskId];
        io.emit('highlight-task', activeTasks);
    });
    /**
 * Handles disconnection1
 */
    socket.on('disconnect', () => {
        connectedClients--;
        io.emit('client-count', connectedClients); // Update client count on disconnect

        Object.keys(activeTasks).forEach((taskId) => {
            if (activeTasks[taskId] === socket.id) delete activeTasks[taskId];
        });
        io.emit('highlight-task', activeTasks);

        console.log('User disconnected:', socket.id);
    });
});
server.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
});