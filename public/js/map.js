// js/map.js
import { TILE_SIZE, drawTile } from './tiles.js';

let map = [];

const response = await fetch('./config.json');
const gameConfig  = await response.json();

//console.log(gameConfig)

const canvas = document.getElementById('gameCanvas');

export function setMap(data) {
    map = data;
    //console.log(map)
}

export function drawMap(ctx, playerX, playerY) {
    const TILE_SCREEN_SIZE = canvas.width / gameConfig.visibleTilesX;

    if (!map.length) return;

    const startX = Math.floor(playerX / TILE_SIZE) - Math.ceil(gameConfig.visibleTilesX / 2) - 1;
    const endX = Math.ceil(playerX / TILE_SIZE) + Math.ceil(gameConfig.visibleTilesX / 2) + 2;

    const startY = Math.floor(playerY / TILE_SIZE) - Math.ceil(gameConfig.visibleTilesY / 2) - 1;
    const endY = Math.ceil(playerY / TILE_SIZE) + Math.ceil(gameConfig.visibleTilesY / 2) + 2;

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            if (map[y] && map[y][x] !== undefined) {
                const tileId = map[y][x];

                const screenX = (x * TILE_SIZE - playerX) * (TILE_SCREEN_SIZE / TILE_SIZE) + canvas.width / 2 - TILE_SCREEN_SIZE;
                const screenY = (y * TILE_SIZE - playerY) * (TILE_SCREEN_SIZE / TILE_SIZE) + canvas.height / 2 - TILE_SCREEN_SIZE;

                drawTile(ctx, tileId, screenX, screenY, TILE_SCREEN_SIZE);
            }
        }
    }
}



export function isBlockedTile(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);

    if (!map[tileY] || map[tileY][tileX] === undefined) return true;

    const tile = map[tileY][tileX];
    return tile === 30 || tile === 2; // napr. múr alebo strom
}
