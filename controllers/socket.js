
module.exports = function SocketController(socket) {

    socket.on('msg', (msg) => console.log(msg));

}