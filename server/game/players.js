const players = {}; // Objekt so všetkými hráčmi
const { gameMap } = require('../maps'); // načítaj mapu
const gameMap1 = require('../maps/empy_map.json');


function handlePlayerConnection(socket, io) {
    // Vytvor nového hráča
    players[socket.id] = {
        id: socket.id,
        x: 1000, // Štartovacia pozícia
        y: 1000,
        name: '',
        direction: 'down',
        moving: false
    };

    // Pošli hráčovi mapu
    socket.emit('initMap', gameMap1);

    // Pošli hráčovi jeho ID a ostatných hráčov
    socket.emit('initData', {
        id: socket.id,
        players: players,
        note: "serus"
    });

    // Informuj ostatných hráčov o novom hráčovi
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Spracuj pohyb hráča
    socket.on('move', (data) => {
        if (players[socket.id]) {
            if (Math.abs(data.x - players[socket.id].x) < 5 && Math.abs(data.y - players[socket.id].y) < 5) {
                players[socket.id].x = data.x;
                players[socket.id].y = data.y;
                players[socket.id].direction = data.direction;
                players[socket.id].moving = true;

                socket.broadcast.emit('playerMoved', {
                    id: socket.id,
                    x: players[socket.id].x,
                    y: players[socket.id].y,
                    direction: players[socket.id].direction,
                    moving: players[socket.id].moving
                });
            }
        }
    });

    // Spracuj zastavenie hráča
    socket.on('stop_moving', (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].direction = data.direction;
            players[socket.id].moving = false;
        }
    });

    // Odpojenie hráča
    socket.on('disconnect', () => {
        console.log(`❌ Hráč odpojený: ${socket.id}`);
        delete players[socket.id];
        socket.broadcast.emit('playerDisconnected', socket.id);
    });
}

function getPlayers() {
    return players;
}

module.exports = { handlePlayerConnection, getPlayers };
