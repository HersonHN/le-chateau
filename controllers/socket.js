
module.exports = function SocketController(socket) {

    socket.on('msg', (message) => {
        console.log(message)
        socket.broadcast.emit('msg', message);
    });

}