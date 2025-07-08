// main.js
import { initSocketHandlers } from './js/socket.js';
import { loop } from './js/gameloop.js';
import { setupInput } from './js/input.js';
import { player } from './js/player.js';

// const response = await fetch('./config.json');
// const gameConfig  = await response.json();
//console.log(gameConfig);

window.time = {}; // vytvoríš globálnu premennú

// inicializácia inputu
setupInput();
initSocketHandlers(player, () => {
    console.log("awdawd")
    loop(); // spustí sa po prijatí mapy
});

// // reakcia na meno z formulára
// window.startGame = function () {
//     const input = document.getElementById('playerName').value.trim();
//     if (!input) return;
//     document.getElementById('nameForm').style.display = 'none';
//     setPlayerName(input);
// };