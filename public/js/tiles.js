// js/tiles.js
export const TILE_SIZE = 8;
const canvas = document.getElementById('gameCanvas');
const tilesPerRow = 13;

const tileSet = new Image();
tileSet.src = '/tiles/TileSet.png';

export function drawTile(ctx, tileId, screenX, screenY, TILE_SCREEN_SIZE) {
    ctx.drawImage(
        tileSet,
        (tileId % tilesPerRow) * TILE_SIZE, Math.floor(tileId / tilesPerRow) * TILE_SIZE, TILE_SIZE, TILE_SIZE,     // zdroj: x, y, šírka, výška
        screenX, screenY, TILE_SCREEN_SIZE, TILE_SCREEN_SIZE // cieľ: x, y, šírka, výška
    );

}
