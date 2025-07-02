// js/otherPlayers.js
import { TILE_SIZE } from './tiles.js';
import { drawName } from './drawUtils.js';

const others = {};

export function updateOtherPlayers(players) {
    console.log(players);
    for (const id in players) {
        if (!others[id]) {
            others[id] = players[id];
        } else {
            others[id].x = players[id].x;
            others[id].y = players[id].y;
            others[id].name = players[id].name;
        }
    }
}

export function addOtherPlayer(player) {
    others[player.id] = player;
}

export function removeOtherPlayer(id) {
    delete others[id];
}

export function drawOtherPlayers(ctx, cameraX, cameraY) {
    for (const id in others) {
        const p = others[id];
        ctx.fillStyle = 'red';
        ctx.fillRect(p.x - cameraX, p.y - cameraY, TILE_SIZE, TILE_SIZE);
        drawName(ctx, p.name, p.x - cameraX, p.y - cameraY - 10);
    }
}