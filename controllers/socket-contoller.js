const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const file = path.join(__dirname, '../templates/partials/message.html');
const templateTXT = fs.readFileSync(file, { encoding: 'utf-8' });
var template = nunjucks.compile(templateTXT);


module.exports = function SocketController(socket) {

    socket.on('join', function(room) {
        socket.join(room);

        socket.on('message', function (message) {

            message.timestamp = timestamp();
            let id = socket.id;
            let messageHTML = template.render({ message });
            
            // send the message to all other members of the room
            socket.to(room).emit('message', messageHTML);

            // send the message to the socket itseft
            this.emit('message', messageHTML);
            
        });
    });

}


function timestamp() {
    return +(new Date());
}