// // FIXED počet tiles pre krátku stranu
// const BASE_VIEWPORT_TILES = 15; // počet tiles pre menšiu stranu (výška alebo šírka)
// const TILE_SIZE = 32;           // veľkosť jedného tile v pixeloch
//
// export let viewportTilesX = BASE_VIEWPORT_TILES; // dynamický počet tiles na šírku
// export let viewportTilesY = BASE_VIEWPORT_TILES; // dynamický počet tiles na výšku
//
// function resizeCanvasToWindow(canvas, ctx) {
//     const canvasWidth = window.innerWidth;
//     const canvasHeight = window.innerHeight;
//
//     const aspectRatio = canvasWidth / canvasHeight;
//
//     if (aspectRatio >= 1) {
//         // Široká obrazovka -> viac tiles na šírku
//         viewportTilesY = BASE_VIEWPORT_TILES;
//         viewportTilesX = Math.round(BASE_VIEWPORT_TILES * aspectRatio);
//     } else {
//         // Vysoká obrazovka -> viac tiles na výšku
//         viewportTilesX = BASE_VIEWPORT_TILES;
//         viewportTilesY = Math.round(BASE_VIEWPORT_TILES / aspectRatio);
//     }
//
//     const logicalWidth = viewportTilesX * TILE_SIZE;
//     const logicalHeight = viewportTilesY * TILE_SIZE;
//
//     // Vypočítaj scale pre zachovanie pomeru strán
//     const scaleX = canvasWidth / logicalWidth;
//     const scaleY = canvasHeight / logicalHeight;
//     const scale = Math.min(scaleX, scaleY);
//
//     // Offset pre centrovanie (čierne pruhy)
//     const offsetX = (canvasWidth - logicalWidth * scale) / 2;
//     const offsetY = (canvasHeight - logicalHeight * scale) / 2;
//
//     // Nastav fyzické rozmery
//     canvas.width = canvasWidth * devicePixelRatio;
//     canvas.height = canvasHeight * devicePixelRatio;
//     canvas.style.width = `${canvasWidth}px`;
//     canvas.style.height = `${canvasHeight}px`;
//
//     // Reset a nastav kontext
//     ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
//     ctx.scale(devicePixelRatio, devicePixelRatio);
//     ctx.translate(offsetX, offsetY);
//     ctx.scale(scale, scale);
//
//     console.log(`🎯 Viewport: ${viewportTilesX}x${viewportTilesY}, scale: ${scale.toFixed(2)}`);
// }

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



window.addEventListener('resize', () => {
    const canvas = document.getElementById('gameCanvas');
    console.log('Window resized!');
    console.log("ww: ", window.innerWidth, "wh: ", window.innerHeight);
    // tu môžeš napríklad upraviť veľkosť canvasu
    resizeCanvas(canvas);

});

resizeCanvas(document.getElementById('gameCanvas'));