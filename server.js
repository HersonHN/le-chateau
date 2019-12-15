
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');

const { CHATEAU_PORT, CHATEAU_DB, NODE_ENV } = process.env;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

const SocketController = require('./controllers/socket-contoller');
const IndexController = require('./controllers/index-contoller');
const RoomController = require('./controllers/room-contoller');


app.use(express.static('static'));
app.set('HOME', __dirname);

app.get('/', IndexController);
app.get('/room/:room', RoomController);
io.on('connection', SocketController);


mongoose.connect(CHATEAU_DB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('connected to mongoDB'))
    .then(() => server.listen(CHATEAU_PORT))
    .then(() => console.log(`running on http://localhost:${CHATEAU_PORT}/`))
    .catch(console.error)
