// js/player.js
import { socket } from './socketClient.js';
import { isBlockedTile } from './map.js';
import {drawCharacterIdle, drawCharacterWalk} from "./character.js";

export const player = {
    id: 0,
    x: 1000,
    y: 1000,
    size: 32,
    speed: 2,
    name: 'Hráč',
    direction: 'down',
    moving: 'false'
};

export function setPlayerName(name) {
    player.name = name;
}

export function updatePlayer(keys) {
    let nextX = player.x;
    let nextY = player.y;
    let moved = false;

    // len jeden smer naraz, v poradí: hore, dole, vľavo, vpravo
    if (keys['w']) {
        nextY -= player.speed;
        player.direction = 'up';
        moved = true;
    } else if (keys['s']) {
        nextY += player.speed;
        player.direction = 'down';
        moved = true;
    } else if (keys['a']) {
        nextX -= player.speed;
        player.direction = 'left';
        moved = true;
    } else if (keys['d']) {
        nextX += player.speed;
        player.direction = 'right';
        moved = true;
    }

    const centerX = nextX + player.size / 2;
    const centerY = nextY + player.size / 2;

     if (!isBlockedTile(centerX, centerY) && moved) {
         player.x = nextX;
         player.y = nextY;
         socket.emit('move', { x: player.x, y: player.y, direction: player.direction });
         player.moving = true;
     } else {
         player.moving = false;
         socket.emit('stop_moving', { x: player.x, y: player.y, direction: player.direction });
     }
}

export function drawLocalPlayer(ctx, cameraX, cameraY, drawName) {
    //console.log(player.moving);
    if (player.moving) {
        drawCharacterWalk(ctx,player.x - cameraX - 16, player.y - cameraY - 16, player.direction);
    }else {
        drawCharacterIdle(ctx,player.x - cameraX - 16, player.y - cameraY - 16, player.direction);
    }

    drawName(ctx, player.name, player.x - cameraX, player.y - cameraY + 40);
}
