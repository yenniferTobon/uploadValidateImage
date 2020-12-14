const mongoose = require('mongoose');

let imagenScheme = new mongoose.Schema({
    photoPath: { type: String, required: true },
    photoPathUpdate: { type: String },
    title: { type: String, required: true },
    idTrx: { type: String, required: true },
    photo_height: { type: String },
    photo_width: { type: String },
    new_height: { type: String },
    new_width: { type: String }
});

mongoose.model('imagen', imagenScheme);
module.exports = mongoose.model('imagen');
