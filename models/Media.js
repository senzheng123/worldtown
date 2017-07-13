var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    photos: {
        type: [],
        default: []
    }
});

schema.set('versionKey', false);

module.exports = mongoose.model('Media', schema, 'media');