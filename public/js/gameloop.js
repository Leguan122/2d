// js/gameLoop.js
import { keys } from './input.js';
import { player, updatePlayer, drawLocalPlayer } from './player.js';
import { drawMap } from './map.js';
import { drawOtherPlayers } from './otherPlayers.js';
import { drawName } from './drawUtils.js';
import { updateCharacterAnimation } from './character.js';
import { applyEnvironmentFilter } from './ctxFilters.js';

const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let lastTimestamp = 0;

export function loop(timestamp = 0) {
    //console.log("loop")
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    update(delta);
    draw(delta);
    requestAnimationFrame(loop);
}

function update(delta) {
    updatePlayer(keys);
    updateCharacterAnimation(delta);
}

function draw(delta) {
    //console.log("w: ", canvas.width, "h: ", canvas.height);
    //console.log(window.time)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cameraX = canvas.width / 2 + player.size / 2;
    const cameraY = canvas.height / 2 + player.size / 2;

    //console.log(cameraX, cameraY);

    drawMap(ctx, player.x, player.y);
    drawOtherPlayers(ctx, cameraX, cameraY, delta);
    drawLocalPlayer(ctx, cameraX, cameraY, drawName);
    // Aplikuj filter podľa serverového času

    //applyEnvironmentFilter(ctx, window.time);

    //drawHUD(hudctx);
}
