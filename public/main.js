// main.js
import { initSocketHandlers } from './js/socket.js';
import { loop } from './js/gameLoop.js';
import { setupInput } from './js/input.js';
import { player, setPlayerName } from './js/player.js';

// inicializácia
setupInput();
initSocketHandlers(player, () => {
    loop(); // spustí sa po prijatí mapy
});

// reakcia na meno z formulára
window.startGame = function () {
    const input = document.getElementById('playerName').value.trim();
    if (!input) return;
    document.getElementById('nameForm').style.display = 'none';
    setPlayerName(input);
};