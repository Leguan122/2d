// js/character.js

const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;
const FRAMES_PER_DIRECTION_IDLE = 12;
const DIRECTIONS = ['down', 'left', 'right', 'up'];

const idle_sprite = new Image();
idle_sprite.src = '/sprites/Unarmed_Idle_full.png';

const walking_sprite = new Image();
walking_sprite.src = '/sprites/Unarmed_Walk_full.png';

let frameIndex = 0;
let frameTimer = 0;
const frameInterval = 300; // ms

export function updateCharacterAnimation(deltaTime) {
    frameTimer += deltaTime;
    if (frameTimer >= frameInterval) {
        frameTimer = 0;
        frameIndex = (frameIndex + 1) % FRAMES_PER_DIRECTION_IDLE;
    }
}

export function drawCharacterIdle(ctx, x, y, direction = 'down') {
    const dirIndex = DIRECTIONS.indexOf(direction);
    if (dirIndex === -1) return;

    const sx = frameIndex * FRAME_WIDTH;
    const sy = dirIndex * FRAME_HEIGHT;

    ctx.drawImage(
        idle_sprite,
        sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
        x, y, FRAME_WIDTH, FRAME_HEIGHT
    );
}

export function drawCharacterWalk(ctx, x, y, direction = 'down') {
    const dirIndex = DIRECTIONS.indexOf(direction);
    if (dirIndex === -1) return;

    const sx = frameIndex * FRAME_WIDTH;
    const sy = dirIndex * FRAME_HEIGHT;

    ctx.drawImage(
        walking_sprite,
        sx, sy, FRAME_WIDTH, FRAME_HEIGHT,
        x, y, FRAME_WIDTH, FRAME_HEIGHT
    );
}
