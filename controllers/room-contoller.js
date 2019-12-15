const mongoose = require('mongoose');
const Message = require('../models/Message');


module.exports = async function RoomController(req, res) {
    let { room } = req.params;
    let messages = await getMessages(room);
    messages.reverse();

    res.render('room.html', { room, messages });
}

function getMessages(room) {
    let model = mongoose.model(room, Message, room);
    let query = model.find({})
        .limit(50)
        .sort({ timestamp: -1 });

    return query.exec();
}
