const path = require('path');

module.exports = function RoomController(req, res) {
    let file = path.join(__dirname, '../templates/room.html');
    res.sendFile(file);
}
