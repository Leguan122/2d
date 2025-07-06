const express = require('express');
const http = require('http');
const { initSocket } = require('./server/io');

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

const PORT = 3000;

// Inicializácia Socket.IO a odovzdanie servera
initSocket(server);


server.listen(PORT, () => {
    console.log(`Server beží na http://localhost:${PORT}`);
});
