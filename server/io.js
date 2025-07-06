const { Server } = require('socket.io');
const { handlePlayerConnection } = require('./game/players');
const {startTimeBroadcast} = require("./game/time");

let io; // Socket.IO inštancia

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*", // dočasne povolíme všetko
            methods: ["GET", "POST"]
        }
    });

    console.log('✅ Socket.IO inicializovaný');
    startTimeBroadcast(io);

    io.on('connection', (socket) => {
        console.log(`🔗 Hráč pripojený: ${socket.id}`);
        // Odovzdaj socket a io do players.js
        handlePlayerConnection(socket, io);
    });
}

function getIO() {
    if (!io) throw new Error('❌ Socket.IO ešte nie je inicializované!');
    return io;
}

module.exports = { initSocket, getIO };
