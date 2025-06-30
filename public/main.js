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
let trees = {};

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

socket.on('trees', (data) => {
    trees = data;
})
function startGame() {
    playerName = document.getElementById('playerName').value.trim();
    if (!playerName) return;

    document.getElementById('nameForm').style.display = 'none';

    // Pošli meno na server
    socket.emit('setName', playerName);
}

function update() {
    let nextX = player.x;
    let nextY = player.y;

    if (keys['w']) nextY -= player.speed;
    if (keys['s']) nextY += player.speed;
    if (keys['a']) nextX -= player.speed;
    if (keys['d']) nextX += player.speed;

    // kontrola kolízie
    if (!collidesWithTree(nextX, nextY, player.size)) {
        player.x = nextX;
        player.y = nextY;
        socket.emit('move', { x: player.x, y: player.y });
    }
}

function draw() {
    const cameraX = player.x - canvas.width / 2;
    const cameraY = player.y - canvas.height / 2;


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mriežka pozadia
    const mapWidth = 2000;
    const mapHeight = 2000;
    for (let x = 0; x < mapWidth; x += 100) {
        for (let y = 0; y < mapHeight; y += 100) {
            ctx.strokeStyle = "#ccc";
            ctx.strokeRect(x - cameraX, y - cameraY, 100, 100);
        }
    }

    // Hráč
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - cameraX, player.y - cameraY, player.size, player.size);
    drawName(player.name || 'Ty', player.x - cameraX, player.y - cameraY);
    drawPosition(player, player.x - cameraX, player.y - cameraY)

    // Ostatní hráči
    for (const id in otherPlayers) {
        const p = otherPlayers[id];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - cameraX, p.y - cameraY, player.size, player.size);
        drawName(p.name, p.x - cameraX, p.y - cameraY);
    }

    for (const i in trees) {
        ctx.fillStyle = "green";
        ctx.fillRect(trees[i].x - cameraX, trees[i].y - cameraY, trees[i].size, trees[i].size);
    }

}

function collidesWithTree(x, y, size) {
    if (x < 0 || (x + size) > 2000) return true;
    if (y < 0 || (y + size) > 2000) return true;

    for (const i in trees) {
        const dx = x + size / 2 - (trees[i].x + trees[i].size / 2);
        const dy = y + size / 2 - (trees[i].y + trees[i].size / 2);
        const dist = Math.hypot(dx, dy);

        const minDist = (size + trees[i].size) / 2;
        if (dist < minDist) {
            return true; // kolízia
        }
    }
    return false;
}
function drawName(name, x, y) {
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(name, x + player.size / 2, y + player.size + 16);
}

function drawPosition(name, x, y) {
    ctx.font = "14px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(name.x, x + player.size / 2, y + player.size + 32);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
