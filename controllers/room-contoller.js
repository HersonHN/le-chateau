const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

const Message = require('../models/Message');


module.exports = async function RoomController(req, res) {
    let { room } = req.params;
    let messages = await getMessages(room);
    messages = format(messages);

    res.render('room.html', { room, messages });
}

function getMessages(room) {
    let model = mongoose.model(room, Message, room);
    let query = model.find({})
        .limit(50)
        .sort({ timestamp: -1 });

    return query.exec();
}

function format(list) {
    return list.map(row => ({
        message: row.message,
        author: row.author,
        time: relativeTime(row.timestamp),
    }))
}

function relativeTime(timestamp) {
    return moment(timestamp).fromNow();
}