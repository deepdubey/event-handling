const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Images = new Schema({
    titleOfEvent: { type: String },
    descOfEvent: {type: String},
    images: [ { name: String, captionOfEvent: String } ],
    flink: { type: String },
    ilink: { type: String } 
}, { collection: 'imagesTitle' });

module.exports = mongoose.model('imagesTitle', Images);
