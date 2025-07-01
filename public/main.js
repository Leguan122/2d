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
let map = {};
const TILE_SIZE = 32;
const TILES_PER_ROW = 9; // 304 px šírka / 32 = 9 stĺpcov

const rocks_tileSheet = new Image();
rocks_tileSheet.src = './tiles/Rocks_source_no_shadow.png';
const trees_tileSheet = new Image();
trees_tileSheet.src = './tiles/Trees_shadow_source.png';

// Lokálny hráč
const player = {
    x: 200,
    y: 200,
    size: 32,
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

socket.on('initMap', (data) => {
    map = data;
    console.log('Mapa prijatá', map);
    loop();
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

    // kolízia sa kontroluje pre stred hráča
    const centerX = nextX + player.size / 2;
    const centerY = nextY + player.size / 2;

    // kontrola kolízie
    if (!isBlockedTile(centerX, centerY)) {
        player.x = nextX;
        player.y = nextY;
        socket.emit('move', { x: player.x, y: player.y });
    }
}

function draw() {
    const cameraX = player.x - canvas.width / 2;
    const cameraY = player.y - canvas.height / 2;


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (map) {drawMap(cameraX,cameraY)}
    //drawMap(); // najprv vykreslíme mapu

    // // Mriežka pozadia
    // const mapWidth = 2000;
    // const mapHeight = 2000;
    // for (let x = 0; x < mapWidth; x += 100) {
    //     for (let y = 0; y < mapHeight; y += 100) {
    //         ctx.strokeStyle = "#ccc";
    //         ctx.strokeRect(x - cameraX, y - cameraY, 100, 100);
    //     }
    // }

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



}

function drawMap(cameraX,cameraY) {
    if (!map || map.length === 0) return;

    const rows = map.length;
    const cols = map[0].length;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const tile = map[y][x];
            const screenX = x * TILE_SIZE - cameraX;
            const screenY = y * TILE_SIZE - cameraY;

            switch (tile) {
                case 0: // tráva
                    ctx.fillStyle = '#88cc88';
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    break;
                case 1: // múr
                    ctx.fillStyle = '#88cc88';
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.drawImage(
                        rocks_tileSheet,
                        32, 240, TILE_SIZE, TILE_SIZE,     // zdroj: x, y, šírka, výška
                        screenX, screenY, TILE_SIZE, TILE_SIZE // cieľ: x, y, šírka, výška
                    );
                    break;
                case 2: // strom
                    //ctx.fillStyle = '#228B22';
                    ctx.fillStyle = '#88cc88';
                    ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
                    ctx.drawImage(
                        trees_tileSheet,
                        679, 89, TILE_SIZE, TILE_SIZE,     // zdroj: x, y, šírka, výška
                        screenX, screenY, TILE_SIZE, TILE_SIZE // cieľ: x, y, šírka, výška
                    );
                    break;
                default:
                    ctx.fillStyle = 'magenta'; // neznáma hodnota
            }


            //drawTile(map[y][x], screenX, screenY);
            // ctx.drawImage(
            //     rocks_tileSheet,
            //     0, 0, TILE_SIZE, TILE_SIZE,     // zdroj: x, y, šírka, výška
            //     screenX, screenY, TILE_SIZE, TILE_SIZE // cieľ: x, y, šírka, výška
            // );
        }
    }
}

function drawTile(tileId, screenX, screenY) {
    const sx = (tileId % TILES_PER_ROW) * TILE_SIZE;
    const sy = Math.floor(tileId / TILES_PER_ROW) * TILE_SIZE;

    ctx.drawImage(
        tileSheet,
        sx, sy, TILE_SIZE, TILE_SIZE,     // zdroj: x, y, šírka, výška
        screenX, screenY, TILE_SIZE, TILE_SIZE // cieľ: x, y, šírka, výška
    );
}

function isBlockedTile(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);

    // mimo mapu = zablokované
    if (
        tileY < 0 || tileY >= map.length ||
        tileX < 0 || tileX >= map[0].length
    ) {
        return true;
    }

    const tile = map[tileY][tileX];

    // 1 = múr, 2 = strom → blokované
    return tile === 1 || tile === 2;
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


