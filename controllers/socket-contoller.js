const moment = require('moment');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const Message = require('../models/Message');

const { parseCommand } = require('./slash-command-controller');

module.exports = function SocketController(socket) {

    socket.on('join', function(room) {
        socket.join(room);

        socket.on('message', function (message) {
            let selfSocket = this;
            message = validate(message);

            if (message.isCommand) {
                parseCommand(message).then((message) => {
                    processMessage({ message, socket, room, selfSocket });
                });

            } else {
                processMessage({ message, socket, room, selfSocket });
            }
        });
    });

}


function validate(m) {
    m.message = m.message.trim();
    m.author = m.author.trim();

    if (m.author.length > 40) return { error: 'Author name too long' };
    if (m.message.length > 1500) return { error: 'Message too long' };

    m.isCommand = (m.message.indexOf('/') === 0);

    return m;
}


function processMessage({ message, socket, room, selfSocket }) {
    if (message.error) {
        message.author = 'error';
        message.message = message.error;
        message.selfMessage = true;
    }

    let timestampUTC = moment.utc().valueOf();
    message.timestamp = timestampUTC;

    let html = nunjucks.render('partials/message.html', { message });
    message.html = html;

    if (!message.selfMessage) {
        // self messages (like error messages) aren't saved
        let model = mongoose.model(room, Message, room);
        model.create(message);

        // send the message to all other members of the room
        socket.to(room).emit('message', message);
    }
    
    // send the message to the socket itseft
    selfSocket.emit('message', { html, selfMessage: true });
}
