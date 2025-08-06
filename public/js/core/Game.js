import { redraw } from './draw.js';

export const Game = {
    socket: null,
    map: null,
    players: {},
    camera: { x: 0, y: 0 },

    initMap(map){
        console.log("Init map");
        Game.map = map;
        redraw();
    }
}