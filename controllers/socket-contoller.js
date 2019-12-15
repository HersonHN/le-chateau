const moment = require('moment');
const mongoose = require('mongoose');
const Message = require('../models/Message');

module.exports = function SocketController(socket) {

    socket.on('join', function(room) {
        socket.join(room);

        socket.on('message', function (message) {
            let timestampUTC = moment.utc().valueOf();
            message.timestamp = timestampUTC;
            
            let model = mongoose.model(room, Message, room);
            model.create(message);

            // send the message to all other members of the room
            socket.to(room).emit('message', message);
        });
    });

}

