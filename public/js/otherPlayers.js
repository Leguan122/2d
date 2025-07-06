// js/otherPlayers.js
import { TILE_SIZE } from './tiles.js';
import { drawName } from './drawUtils.js';
import { drawCharacterIdle, drawCharacterWalk } from './character.js';
import {player} from "./player.js";

const others = {};

export function initOtherPlayers(players) {
    for (const id in players) {
        const p = players[id];
        console.log("initOtherPlayers", id);
        console.log("initOtherPlayers", players[id]);
        if (player.id !== p.id){
            others[id] = {
                id: p.id,
                x: p.x,
                y: p.y,
                targetX: p.x,
                targetY: p.y,
                name: p.name,
                direction: p.direction,
                moving: p.moving,
                interpolationTime: 0
            };
        }
    }
}

export function updateOtherPlayers(players) {
    for (const id in players) {
        const serverPlayer = players[id];

        if (!others[id]) {
            others[id] = {
                id: serverPlayer.id,
                x: serverPlayer.x,
                y: serverPlayer.y,
                targetX: serverPlayer.x,
                targetY: serverPlayer.y,
                name: serverPlayer.name,
                direction: serverPlayer.direction,
                moving: serverPlayer.moving,
                interpolationTime: 0
            };
        } else {
            const localPlayer = others[id];
            localPlayer.id = serverPlayer.id,
            localPlayer.targetX = serverPlayer.x;
            localPlayer.targetY = serverPlayer.y;
            localPlayer.name = serverPlayer.name;
            localPlayer.direction = serverPlayer.direction;
            localPlayer.moving = serverPlayer.moving;
            localPlayer.interpolationTime = 0; // reset interpolácie
        }
    }
}

export function updateOtherPlayer(data) {
    if (others[data.id]) {
        others[data.id].targetX = data.x;
        others[data.id].targetY = data.y;
        others[data.id].direction = data.direction;
        others[data.id].moving = data.moving;
    }
}


export function addOtherPlayer(player) {
    others[player.id] = {
        id: player.id,
        x: player.x,
        y: player.y,
        targetX: player.x,
        targetY: player.y,
        name: player.name,
        direction: player.direction,
        moving: player.moving,
        interpolationTime: 0
    };
}

export function removeOtherPlayer(id) {
    delete others[id];
}

export function drawOtherPlayers(ctx, cameraX, cameraY, delta) {
    //console.log(others);
    for (const id in others) {
        const p = others[id];
        if (player.id !== p.id){
            // Zvýšime čas interpolácie (delta = čas medzi frame-mi v ms)
            p.interpolationTime += delta;

            const t = Math.min(p.interpolationTime / 30, 1); // 50ms = server tick interval

            // Lineárna interpolácia medzi aktuálnou a cieľovou pozíciou
            p.x = p.x + (p.targetX - p.x) * t;
            p.y = p.y + (p.targetY - p.y) * t;

            // Animácia podľa toho, či sa hráč hýbe
            if (p.moving) {
                drawCharacterWalk(ctx, p.x - cameraX - 16, p.y - cameraY - 26, p.direction);
            } else {
                drawCharacterIdle(ctx, p.x - cameraX - 16, p.y - cameraY - 26, p.direction);
            }

            drawName(ctx, p.name, p.x - cameraX, p.y - cameraY - 10);
        }


    }
}
