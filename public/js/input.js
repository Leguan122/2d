// js/input.js
export const keys = {};

export function setupInput() {
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        //console.log("down")
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
}
