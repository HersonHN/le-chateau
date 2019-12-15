const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    message: String,
    author: String,
    timestamp: Number
});