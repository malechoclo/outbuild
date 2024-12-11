const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
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

io.on('connection', (socket) => {
    connectedClients++;
    io.emit('client-count', connectedClients); // Notify all clients about the new count

    console.log('User connected:', socket.id);

    socket.emit('update-board', board);
    socket.emit('highlight-task', activeTasks);

    socket.on('task-update', (newBoard) => {
        board = newBoard;
        socket.broadcast.emit('update-board', board);
    });

    socket.on('interact-task', ({ taskId }) => {
        activeTasks[taskId] = socket.id;
        io.emit('highlight-task', activeTasks);
    });

    socket.on('stop-interact-task', ({ taskId }) => {
        delete activeTasks[taskId];
        io.emit('highlight-task', activeTasks);
    });

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