// js/player.js
import { socket } from './socketClient.js';
import { isBlockedTile } from './map.js';
import {drawCharacter, drawCharacterIdle, drawCharacterWalk, drawPlayer} from "./character.js";
import {drawPosition} from "./drawUtils.js";

export const player = {
    id: 0,
    x: 0,
    y: 0,
    size: 32,
    speed: 1,
    name: 'Hráč',
    direction: 'down',
    moving: 'false',
    currentAnimation: 'walk_down',
    currentFrame: 0,
    elapsed: 0,
    flipX: false, // ak je smer doľava
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
    //drawCharacter(ctx,cameraX, cameraY);
    drawPlayer(ctx, player, cameraX, cameraY);
    // if (player.moving) {
    //     drawCharacterWalk(ctx,cameraX, cameraY, player.direction);
    // }else {
    //     drawCharacterIdle(ctx,cameraX, cameraY, player.direction);
    // }

    drawName(ctx, player.name, player.x - cameraX, player.y - cameraY + 40);
    drawPosition(ctx,cameraX, cameraY, player.x, player.y);

}
