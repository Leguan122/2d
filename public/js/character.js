// js/character.js

const FRAME_WIDTH = 32;
const FRAME_HEIGHT = 32;
const FRAMES_PER_DIRECTION_IDLE = 12;
const DIRECTIONS = ['down', 'left', 'right', 'up'];

const character_sprite = new Image();
character_sprite.src = '/sprites/AnimationList.png';

export const Animations = {
    idle_down:  { row: 0, frames: 2, loop: true, frameDuration: 200, startFrame: 0 },
    idle_up:    { row: 1, frames: 2, loop: true, frameDuration: 200, startFrame: 0 },
    idle_side:  { row: 2, frames: 2, loop: true, frameDuration: 200, startFrame: 0 },
    walk_down:  { row: 3, frames: 4, loop: true, frameDuration: 120, startFrame: 0 },
    walk_up:    { row: 4, frames: 4, loop: true, frameDuration: 120, startFrame: 0 },
    walk_side:  { row: 5, frames: 4, loop: true, frameDuration: 120, startFrame: 0 },
    attack_down: { row: 0, frames: 5, loop: false, frameDuration: 90, startFrame: 6 },
    // ... ďalšie animácie
};

let frameIndex = 0;
let frameTimer = 0;
const frameInterval = 300; // ms

export function updateCharacterAnimation(deltaTime) {
    frameTimer += deltaTime;
    if (frameTimer >= frameInterval) {
        frameTimer = 0;
        frameIndex = (frameIndex + 1) % FRAMES_PER_DIRECTION_IDLE;
        //console.log(frameIndex);
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
        x, y, 64, 64
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

export function drawCharacter (ctx, x, y, animation, direction = 'down') {
    ctx.drawImage(
        character_sprite,
        0, 0, FRAME_WIDTH, FRAME_HEIGHT,
        x, y, FRAME_WIDTH, FRAME_HEIGHT
    );
}

export function drawPlayer(ctx, player, cameraX, cameraY, tileWidth = 32, tileHeight = 32) {
    const anim = Animations[player.currentAnimation];
    console.log(anim);
    const frameX = (anim.startFrame || 0) + player.currentFrame + frameIndex % anim.frames;
    const frameY = anim.row;


    //console.log(frameX, frameY);
    ctx.save();
    if (player.direction === 'left') {
        //ctx.translate(cameraX, cameraY);
        //ctx.scale(-1, 1); // zrkadlenie
        ctx.drawImage(character_sprite,
            frameX * 24, frameY * 24, 24, 24,
            cameraX, cameraY, 100, 100
        );
    } else {
        console.log(player.direction);
        ctx.drawImage(character_sprite,
            frameX * 24, frameY * 24, 24, 24,
            cameraX, cameraY, 100, 100
        );
    }
    ctx.restore();
}
