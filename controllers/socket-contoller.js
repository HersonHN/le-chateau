
module.exports = function SocketController(socket) {

    socket.on('join', function(room) {
        socket.join(room);

        socket.on('message', (message) => {
            console.log(message)
            socket.to(room).emit('message', message);
        });
    });

}