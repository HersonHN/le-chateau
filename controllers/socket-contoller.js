const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const file = path.join(__dirname, '../templates/partials/message.html');
const templateTXT = fs.readFileSync(file, { encoding: 'utf-8' });
var template = nunjucks.compile(templateTXT);

module.exports = function SocketController(socket) {

    socket.on('join', function(room) {
        socket.join(room);

        socket.on('message', function(message) {

            message.timestamp = timestamp();
            let id = socket.id;
            let messageHTML = template.render({ message });
            
            socket.to(room).emit('message', messageHTML);
            socket.to(id).emit('message', messageHTML);
            // io.to().emit('hey', 'I just met you');
        });
    });

}


function timestamp() {
    return +(new Date());
}