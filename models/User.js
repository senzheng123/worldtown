var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    username: String,
    password: String,
    email   : String,
    firstname : String,
    lastname : String,
    phonenumber : String,
    businessname : String,
    businessaddress : String,
    city : String,
    states : String,
    zip : String,
    user_type: Number, // 1 = user ; 2 = service provider ;
    has_agree: Boolean, // user has agreed the term and regulartion
    has_verified : Boolean, // service provider has been verified or not
    quoted_request: Array // the array of request id
 });

schema.set('versionKey', false);
module.exports = mongoose.model('User', schema);

