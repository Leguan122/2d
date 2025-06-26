// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Slúži statické súbory z priečinka "public"
app.use(express.static('public'));

// Uloženie všetkých hráčov
let players = {};

io.on('connection', (socket) => {
    console.log('Nový hráč:', socket.id);

    // Vytvor nového hráča
    players[socket.id] = {
        x: 100 + Math.random() * 400,
        y: 100 + Math.random() * 400,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };

    // Pošli novému hráčovi všetkých ostatných
    socket.emit('currentPlayers', players);

    // Informuj ostatných, že prišiel nový hráč
    socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    // Prijímaj aktualizácie pozície
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y });
        }
    });

    // Odpojenie hráča
    socket.on('disconnect', () => {
        console.log('Odpojený:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server beží na http://localhost:3000');
});
