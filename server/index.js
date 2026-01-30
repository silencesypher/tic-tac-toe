const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let gameState = Array(9).fill(null);
let isXNext = true;

let players = [];

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  socket.on('disconnect', () => {
    console.log("Disconnected:", socket.id);
  });

  if (players.length < 2) {
    const role = players.length === 0 ? 'X' : 'O';
    players.push({ id: socket.id, role });

    socket.emit('role', role);
  } else {
    socket.emit('role', 'spectator');
  }

  socket.emit('state', { gameState, isXNext });

  socket.on('move', (index) => {
    const player = players.find(p => p.id === socket.id);

    if (!player) return;
    if ((isXNext && player.role !== 'X') || (!isXNext && player.role !== 'O')) return;
    if (gameState[index]) return;

    gameState[index] = player.role;
    isXNext = !isXNext;

    io.emit('state', { gameState, isXNext });
  });

  socket.on('disconnect', () => {
    players = players.filter(p => p.id !== socket.id);
    console.log('Player disconnected:', socket.id);
  });

  socket.on('reset', () => {
    const player = players.find(p => p.id === socket.id);

    // only X or O can reset
    if (!player) return;
    if (player.role === 'spectator') return;

    gameState = Array(9).fill(null);
    isXNext = true;

    io.emit('state', { gameState, isXNext });
    });

});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});