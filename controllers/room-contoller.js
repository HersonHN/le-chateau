const mongoose = require('mongoose');
const Message = require('../models/Message');


module.exports = async function RoomController(req, res) {
    let { room } = req.params;

    if (!validName(room)) {
        res.statusCode = 400;
        return res.render('error.html', { error: 'Invalid Room Name' });
    }
    
    let messages = await getMessages(room);
    messages.reverse();

    res.render('room.html', { room, messages });
}

function validName(room) {
    if (room.lenght > 40) return false;
    let valid = room.replace(/[^\-a-zA-Z]/gi, '').toLowerCase();
    return (room === valid);
}

function getMessages(room) {
    let model = mongoose.model(room, Message, room);
    let query = model.find({})
        .limit(50)
        .sort({ timestamp: -1 });

    return query.exec();
}

