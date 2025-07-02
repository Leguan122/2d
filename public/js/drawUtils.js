// js/drawUtils.js
export function drawName(ctx, name, x, y) {
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, x + 16, y);
}

export function drawPosition(ctx, x, y, posX, posY) {
    ctx.fillStyle = 'gray';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`(${Math.floor(posX)}, ${Math.floor(posY)})`, x + 16, y);
}
