// js/tiles.js
export const TILE_SIZE = 32;
const TILES_PER_ROW = 9;

const rocks_tileSheet = new Image();
rocks_tileSheet.src = '/tiles/Rocks_source_no_shadow.png';
const trees_tileSheet = new Image();
trees_tileSheet.src = '/tiles/Trees_shadow_source.png';

export function drawTile(ctx, tileId, screenX, screenY) {
    switch (tileId) {
        case 0: // trava
            ctx.fillStyle = "#7CAE59";
            ctx.fillRect(screenX,screenY,TILE_SIZE,TILE_SIZE);
            break;
        case 1: //kamen
            ctx.fillStyle = "#7CAE59";
            ctx.fillRect(screenX,screenY,TILE_SIZE,TILE_SIZE);
            ctx.drawImage(
                rocks_tileSheet,
                32, 240, TILE_SIZE, TILE_SIZE,
                screenX, screenY, TILE_SIZE, TILE_SIZE
            );
            break;
        case 2: // strom
            //ctx.fillStyle = '#228B22';
            ctx.fillStyle = '#7CAE59';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
            ctx.drawImage(
                trees_tileSheet,
                679, 89, TILE_SIZE, TILE_SIZE,     // zdroj: x, y, šírka, výška
                screenX, screenY, TILE_SIZE, TILE_SIZE // cieľ: x, y, šírka, výška
            );
            break;
        default:
            ctx.fillStyle = '#228B22';
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
    }

}
