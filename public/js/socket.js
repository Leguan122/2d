// js/socket.js
import { socket } from './socketClient.js';
import { setMap } from './map.js';
import { updateOtherPlayers, addOtherPlayer, removeOtherPlayer } from './otherPlayers.js';
import {player} from "./player.js";

export function initSocketHandlers(localPlayer, onReady) {
    socket.on('connect', () => {
        console.log('Pripojený k serveru');
    });

    socket.on('initMap', (serverMap) => {
        //console.log("mapa");
        setMap(serverMap);
        onReady();
    });

    // socket.on('updatePlayers', (players) => {
    //     updateOtherPlayers(players);
    // });

    socket.on('playersState', (players) => {
        updateOtherPlayers(players);
        //console.log(players)
    });

    socket.on('newPlayer', (player) => {
        addOtherPlayer(player);
    });

    socket.on('playerDisconnected', (id) => {
        removeOtherPlayer(id);
    });

    // socket.on('playerMoved', (id) => {
    //     console.log(id);
    // });

    // setInterval(() => {
    //     socket.emit('playerUpdate', localPlayer);
    // }, 1000 / 10);

    socket.on('initData', (id) => {
        player.id = id;
    });
}
