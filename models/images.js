const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const img = new Schema({
    name: { type: String },
    captionOfEvent: { type: String }
});

module.exports = mongoose.model('image', img);