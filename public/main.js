const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

let playerName = '';
const socket = io();

// Lokálny hráč
const player = {
    x: 200,
    y: 200,
    size: 40,
    speed: 5,
    color: 'blue'
};

const keys = {};
const otherPlayers = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

socket.on('currentPlayers', (players) => {
    for (const id in players) {
        if (id !== socket.id) {
            otherPlayers[id] = players[id];
        } else {
            player.x = players[id].x;
            player.y = players[id].y;
            player.color = players[id].color;
            player.name = players[id].name || 'Hráč';
        }
    }
});

socket.on('newPlayer', (data) => {
    otherPlayers[data.id] = data;
});

socket.on('playerMoved', (data) => {
    if (otherPlayers[data.id]) {
        otherPlayers[data.id].x = data.x;
        otherPlayers[data.id].y = data.y;
    }
});

socket.on('playerDisconnected', (id) => {
    delete otherPlayers[id];
});

function startGame() {
    playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;

    document.getElementById('nameForm').style.display = 'none';

    // Pošli meno na server
    socket.emit('setName', playerName);
}

function update() {
    let moved = false;
    if (keys['w']) { player.y -= player.speed; moved = true; }
    if (keys['s']) { player.y += player.speed; moved = true; }
    if (keys['a']) { player.x -= player.speed; moved = true; }
    if (keys['d']) { player.x += player.speed; moved = true; }

    if (moved) {
        socket.emit('move', { x: player.x, y: player.y });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hráč
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
    drawName(player.name || 'Ty', player.x, player.y);

    /// Ostatní hráči
    for (const id in otherPlayers) {
        const p = otherPlayers[id];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, player.size, player.size);
        drawName(p.name, p.x, p.y);
    }
}
function drawName(name, x, y) {
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(name, x + player.size / 2, y + player.size + 16);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
