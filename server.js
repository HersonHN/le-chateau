
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const SocketController = require('./controllers/socket-contoller');
const RoomController = require('./controllers/room-contoller');

const port = process.env.CHATEAU_PORT || 1991;

app.use(express.static('static'));

io.on('connection', SocketController);
app.get('/room/:room', RoomController);

server.listen(port, () => console.log('running on http://localhost:' + port));
