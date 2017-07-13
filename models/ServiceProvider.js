var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    username: String,
    password: String,
    email   : String,
    user_type: Number, // 1 = user ; 2 = service provider ;
    has_agree: Boolean, // user has agreed the term and regulartion
 });

schema.set('versionKey', false);
module.exports = mongoose.model('Serviceprovider', schema, 'Serviceprovider');