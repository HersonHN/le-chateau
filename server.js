
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const { CHATEAU_PORT, CHATEAU_DB } = process.env;


const app = express();
const server = http.Server(app);
const io = socketIO(server);

const SocketController = require('./controllers/socket-contoller');
const RoomController = require('./controllers/room-contoller');

app.use(express.static('static'));
io.on('connection', SocketController);
app.get('/room/:room', RoomController);

mongoose.connect(CHATEAU_DB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('connected to mongoDB'))
    .then(() => server.listen(CHATEAU_PORT))
    .then(() => console.log('running on http://localhost:' + CHATEAU_PORT))
    .catch(console.error)
