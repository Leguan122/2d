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
        id: socket.id,
        x: 1000,
        y: 1000,
        name: '',
        direction: 'down',

    };

    // Pošli novému hráčovi všetkých ostatných
    //socket.emit('currentPlayers', players);

    socket.emit('initData', socket.id);

    // Informuj ostatných, že prišiel nový hráč
    //socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    // Prijímaj aktualizácie pozície
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].direction = data.direction;
            players[socket.id].moving = true;
            //io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y, direction: data.direction });
        }
    });

    socket.on('stop_moving', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].direction = data.direction;
            players[socket.id].moving = false;
           // io.emit('playerMoved', { id: socket.id, x: data.x, y: data.y, direction: data.direction });
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
