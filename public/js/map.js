// js/map.js
import { TILE_SIZE, drawTile } from './tiles.js';

let map = [];

export function setMap(data) {
    map = data;
    console.log(map)
}

export function drawMap(ctx, cameraX, cameraY) {
    if (!map.length) return;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            const tile = map[y][x];
            const screenX = x * TILE_SIZE - cameraX;
            const screenY = y * TILE_SIZE - cameraY;
            drawTile(ctx, tile, screenX, screenY);
        }
    }
}

export function isBlockedTile(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);

    if (!map[tileY] || map[tileY][tileX] === undefined) return true;

    const tile = map[tileY][tileX];
    return tile === 1 || tile === 2; // napr. múr alebo strom
}
