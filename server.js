// server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const gameMap = require('./gameMap.json');
//const {player} = require("./public/js/player.js");

// Slúži statické súbory z priečinka "public"
app.use(express.static('public'));

// Uloženie všetkých hráčov
let players = {};

io.on('connection', (socket) => {
    console.log('Nový hráč:', socket.id);
    socket.emit('initMap', gameMap);

    socket.on('setName', (name) => {
        if (players[socket.id]) {
            players[socket.id].name = name;
            // Oznám ostatným
            socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });
        }
    });

    // Vytvor nového hráča
    players[socket.id] = {
        x: 1000,
        y: 1000,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        name: '',
        direction: 'down',

    };

    // Pošli novému hráčovi všetkých ostatných
    socket.emit('currentPlayers', players);

    // Informuj ostatných, že prišiel nový hráč
    //socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    // Prijímaj aktualizácie pozície
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].direction = data.direction;
            io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y, direction: data.direction });
        }
    });

    // Odpojenie hráča
    socket.on('disconnect', () => {
        console.log('Odpojený:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

setInterval(() => {
    io.emit('playersState', players); // objekt so všetkými hráčmi
}, 1000 / 30);

server.listen(3000, () => {
    console.log('Server beží na http://localhost:3000');
});
