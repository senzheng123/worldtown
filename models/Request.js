var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    year : Number, // year of car made
    make : String, // car brand such as BMW, Benz
    model : String, // car model like BMW X5
    issue : Array, // array of String : such as Brake | A/C
    quote : Array, // array of objects {serviceprovider's id ,serviceprovider's quote}
    distance : Number, // the distance from request's location to serviceprovider's location
    time : Date(), // The time of the request been created
    description : String, // The description of the issue illustrated by Users
    note: Array, // the array of strinf that is note left by serviceprovider
    request_status : Number, //1: request sent 2: request accept 3: scheduled 4: service in process 5: completed 6: canceled
    re_qouted: Number, // the max of re quote will be 2
    scheduled: String,// the scheuled time
    service_reciever:  {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },// THE final reciever for the car
    service_creator:{
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }// the service creator


 });

schema.set('versionKey', false);
module.exports = mongoose.model('Request', schema);
/*
  If the request get quoted and the serviceprovider's id and the price will send into 
  the mail box of user. when the quote is accepted , the quote array will be empty and insert into the accepted quote
  there are 2 chances to get re-qouted and then will sechehuled 
*/