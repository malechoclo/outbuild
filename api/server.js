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

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send current board to the newly connected client
    socket.emit('update-board', board);

    socket.on('task-update', (newBoard) => {
        board = newBoard;
        socket.broadcast.emit('update-board', board); // Notify all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
});