const nunjucks = require('nunjucks');
const moment = require('moment');


module.exports = function SocketController(socket) {

    socket.on('join', function(room) {
        socket.join(room);

        socket.on('message', function (message) {
            let timestampUTC = moment.utc().valueOf();
            message.timestamp = timestampUTC;

            let messageHTML = nunjucks.render('partials/message.html', { message });

            // send the message to all other members of the room
            socket.to(room).emit('message', messageHTML);

            // send the message to the socket itseft
            this.emit('message', messageHTML);
            
        });
    });

}

