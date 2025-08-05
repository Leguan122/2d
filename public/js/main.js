// js/main.js
const socket = io(); // io je globálna funkcia načítaná z CDN

import { Game } from './core/Game.js';

function initSocketHandlers(localPlayer, onReady) {
    socket.on('connect', () => {
        console.log('Pripojený k serveru');
    });

    socket.on('initMap', (serverMap) => {
        console.log("mapa");
        console.log(serverMap);
        Game.init(serverMap);
    });
}




initSocketHandlers();
