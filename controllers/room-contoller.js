const path = require('path');
const mongoose = require('mongoose');
const Message = require('../models/Message');

module.exports = function RoomController(req, res) {
    let { room } = req.params;
    getMessages(room).then(data => res.send(data));
    // let file = path.join(__dirname, '../templates/room.html');
    // res.sendFile(file);
}

function getMessages(room) {
    let model = mongoose.model(room, Message, room);
    let query = model.find({})
        .limit(50)
        .sort({ timestamp: -1 })

    return query.exec();
}
