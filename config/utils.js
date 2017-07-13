var shortid = require('shortid');



var bCrypt = require('bcrypt-nodejs');

var nodemailer = require('nodemailer');

var request = require('request-json');

var sreq = require('sync-request');

var config = require('./config');

//sen's code

//sen ends


var apiKey = 'AIzaSyAY4SM1zC4cNQZlrH9VWyp5s2zUXmkyrlc';//'AIzaSyA_H2hkrquk3xFwmwKR6LzsKsyIBEYkFNU';//'AIzaSyD_Bnw97lQPE0mKtQ0mqYC4jwhAK22iDwA';//'AIzaSyAY4SM1zC4cNQZlrH9VWyp5s2zUXmkyrlc';

var stripe = require('stripe')('sk_test_cAefVlVMmXfcSKMZOKLhielX');

var map = request.createClient('http://ditu.google.cn/');

var sync = require('synchronize');

var path = require('path');

var amqp = require('amqplib/callback_api');

var generateQueue = 'generate';
var trackingQueue = 'tracking';


var User = require('../models/User');
var Media = require('../models/Media');
var Destination = require('../models/Destination');
var Order = require('../models/Order');

var db = require('./dbops.js');

module.exports = {
    path: path,
    //2017.5.6 ---- jimmy

    //update user by email

    /*update: [{item1 : value1}, {item2 : value2}]*/
     

    updateUser: function(email,update){

       var condition = {'email':email};
        //update is a list of updates : structure is an array
        
       User.findOne(condition, function(err, user){
            user = db.parser();

            user.save();

       })
    },
    


    //when user update the info like email and phone and those info should be unique in the database and should not be duplicated
    check_uniqueByemail: function(email){

        
       if(email != null){
         User.findOne({'email': email},function(err, user){
             if(user != null){
                return false;
             }else{
                return true;
             }

            
        })
      }

      if(phoneNumber != null && email == null){
         User.findOne({'phoneNumber': phoneNumber}, function(err, phoneNumber){
              if(phoneNumber != null ){
                return false;
             }else{
                return true;
             }
         })
      }
    },

    


    populateTrip: function (order, cb) {
        var max = order.trip.length;

        var populate = function (count) {

            count = count || 0;

            Order.populate(order, {
                path: 'trip.' + count + '.destination_id',
                model: 'Destination'
            }, function (err, result) {

                Order.populate(result, {
                    path: 'trip.' + count + '.destination_id.media_id',
                    model: 'Media'
                }, function (err, result) {

                    count++;

                    if (count < max) {
                        populate(count);
                    } else {
                        cb(result);
                    }

                });

            });

        };

        populate();
    },
    populateLocalGuidesForOrders: function (orders, cb) {
        var max = 0;

        if (!orders) {
            cb([]);
        }

        if (!orders.length) {
            max = orders.trip.length
        } else {
            orders.forEach(function (order) {
                if (max < order.trip.length) {
                    max = order.trip.length;
                }
            });
        }

        var populate = function (count) {

            count = count || 0;

            Order.populate(orders, {
                path: 'trip.' + count + '.local_guide',
                model: 'User'
            }, function (err, result) {

                Order.populate(result, {
                    path: 'trip.' + count + '.local_guide.media_id',
                    model: 'Media'
                }, function (err, result) {

                    count++;

                    if (count < max) {
                        populate(count);
                    } else {
                        cb(result);
                    }

                });

            });

        };

        populate();
    },
    sendToGenerate: function (input) {
        channel.sendToQueue(generateQueue, new Buffer(JSON.stringify(input)));
        console.log(" [x] Sent");
    },
    sendToTracking: function (input) {
        channel.sendToQueue(trackingQueue, new Buffer(JSON.stringify(input)));
        console.log(" [x] Sent");
    },
    rad: function (x) {
        return x * Math.PI / 180;
    },
    getDistanceMeters: function (p1, p2) {
        var that = this;
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = that.rad(p2.lat - p1.lat);
        var dLong = that.rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(that.rad(p1.lat)) * Math.cos(that.rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    },
    getDistanceSync: function (start, address) {
        var that = this;

        var url = 'wp.0=' + that.escapeString(start) + '&wp.1=' + that.escapeString(
                address) + '&avoid=minimizeTolls&key=Al48Ntqf4YlgWKS124onQyycazkcLvwjFlkP4wNFvGFN9Lp62Przbtzzj2sCv1o5';

        var res = sreq('GET', 'https://dev.virtualearth.net/REST/V1/Routes/Driving?' + url);

        var duration = JSON.parse(res.getBody()).resourceSets[0].resources[0].travelDuration;

        return duration / 60;
    },
    isAdmin: function (req, res, next) {
        if (req.user.is_admin) {

            return next();

        } else {

            return res.redirect('/orders');

        }
    },
    isAuthenticated: function (req, res, next) {

        if (req.isAuthenticated()) {

         //   if (req.user.has_agree) {

               return next();

          //  } else {

          //      req.session.return = req.path;

           //     return res.redirect('/agree');

         //   }

        } else {

            return res.redirect('/?r=' + req.path + '#login');

        }
    },
    getDistanceMatrix: function (addresses) {

        var that = this;

        var start = addresses[0];

        var distanceMatrix = [];

        addresses.forEach(function (address, i) {

            distanceMatrix.push(that.getDistanceSync(start, address));

        });

        return distanceMatrix;

    },
    searchChunk: function (req, res, cb) {
        var limit = 20;

        req.body.p = req.body.p || 1;

        var skip = (req.body.p - 1) * limit;

        req.body.m = req.body.m || 'destination';

        req.body.k = req.body.k || '';

        req.body.c = req.body.c || '';

        if (typeof req.body.k != 'string') {

            throw new Error();

        }

        var keywords = [];

        req.body.k.split(' ').forEach(
            function (keyword) {

                keyword = new RegExp(keyword.replace(/(.*?)/g, ''), 'i');

                if (keyword != '/(?:)/i') {

                    this.push(keyword);

                }

            },
            keywords
        );

        var query = {};

        if (keywords.length) {

            query.$or = [{
                'title.en': {
                    $in: keywords
                }
            }, {
                'title.cn': {
                    $in: keywords
                }
            }, {
                introduction: {
                    $in: keywords
                }
            }, {
                description: {
                    $in: keywords
                }
            }, {
                username: {
                    $in: keywords
                }
            }, {
                reference_no: {
                    $in: keywords
                }
            }];
        }

        if (req.body.c) {

            query.tags = req.query.c;

        }

        if (req.body.m == 'guide') {

            query.is_guide = true;

            query.waiting_approval = {$ne: true};

            User.find(query).limit(limit).skip(skip).populate('media_id').exec(function (error, result) {

                User.count(query, function (error, count) {

                    cb({
                        mode: req.body.m,
                        page: req.body.p,
                        max: Math.ceil(count / limit),
                        keywords: req.body.k,
                        category: req.body.c,
                        results: result
                    });

                });

            });

        } else {

            query.media_id = {$ne: null};

            query.address = {$ne: null};

            query.is_hidden = {$ne: true};

            Destination.find(query).limit(limit).skip(skip).populate('media_id').exec(function (error, result) {

                Destination.count(query, function (error, count) {

                    cb({
                        mode: req.body.m,
                        page: req.body.p,
                        max: Math.ceil(count / limit),
                        keywords: req.body.k,
                        category: req.body.c,
                        results: result
                    });

                });

            });

        }
    },
    sync: sync,
    getGeocodeSync: function (address) {

        var that = this;

        var url = 'maps/api/geocode/json?address=' + address;

        var res = sreq('GET', 'http://ditu.google.cn/' + url);

        return JSON.parse(res.getBody()).results[0].geometry.location;

    },
    getShortestRoute: function (start_point, end_point, destinations, cb) {
        var addresses = [];

        destinations.forEach(function (destination, i) {

            addresses.push(destination.address);

        });

        var waypoints = addresses.join('|');

        var url = 'maps/api/directions/json?origin=' + start_point + '&destination=' + end_point + '&waypoints=optimize:true|' + waypoints;

        map.get(url, function (err, res, body) {
            cb(body);
        });
    },
    escapeString: function (str) {
        return encodeURIComponent(str);
    },
    getParameterByName: function (name, url) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(url);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },
    getShortId: function () {
        return shortid;
    },
    getShortCode : function () {
        //var result = {};
        random.numbers({
            "number": 6,
            "minimum": 0,
            "maximum": 9
        }, function(error, data) {
            return data.join("");
        });


    },
    addOrdersMinutes: function (orders) {
        orders.forEach(function (order, i) {

            var orderMinutes = 0;

            order.trips.forEach(function (trip, j) {

                var tripMinutes = 0;

                var people = 0;

                var count = 0;

                trip.days.forEach(function (day, k) {

                    day.forEach(function (waypoint, l) {

                        trip.destinations.forEach(function (destination, m) {

                            if (destination.destination_id && waypoint.destination_id == destination._id) {

                                count++;

                                tripMinutes += destination.minutes;

                                people += destination.people;

                            }

                        });

                    });

                });

                orders[i].trips[j].people = parseInt(people / count);

                orders[i].trips[j].minutes = tripMinutes;

                orders[i].trips[j].estimate = (tripMinutes * 2).toFixed(2);

                orderMinutes += tripMinutes;

            });

            orders[i].trips.total = orderMinutes;

            orders[i].minutes = orderMinutes;

            orders[i].estimate = ((orderMinutes * 2) - orders[i].paid / 100.0).toFixed(2);
        });
    },
    addMinutes: function (user, forCart) {
        var total = 0;

        user.mytrips.forEach(function (trip, index) {
            var minutes = 0;
            var people = 0;
            var count = 0;
            trip.days.forEach(function (day, j) {
                day.forEach(function (waypoint, k) {
                    trip.destinations.forEach(function (destination) {
                        if (destination.destination_id && waypoint == destination.id) {
                            count++;
                            minutes += destination.minutes;
                            people += destination.people;
                        }
                    });
                });
            });

            if (forCart) {
                if (trip.carted && !trip.checked_out) {
                    total += minutes;
                }
            } else {
                if (!trip.carted) {
                    total += minutes;
                }
            }

            user.mytrips[index].people = parseInt(people / count);
            user.mytrips[index].minutes = minutes;
            user.mytrips[index].estimate = (minutes * 2).toFixed(2);
        });
        user.mytrips.total = total;
    },
    getDistance: function () {
        return distance;
    },
    getStripe: function () {
        return stripe;
    },
    sendVerification : function(email, password, name){
        console.log(password);
        var url = "/successVerify/" + password+ "/" + email;
        var d = new Date();
        var content = "<h5>Dear"+ " " + name + "</h5> <h5>Welcome to UWO TRIP!</h5><p>This email is automatically generated by UWO TRIP.</p>" +
                "<br>"+
            "<p>You are receiving this email because of new user registration or changes to email address.</p>" +
            "<p>If you have never completed the above actions, please ignore this email.</p>" +
            "<p>Verification Instruction:</p>" +
            "<p>Please click on the following link to verify your email.</p>" +
            "<a href= "+ "http://localhost:8080" + url + ">Click </a>" +
            "<p>If above link doesn't work, please copy and paste the link into a new browser.</p>" +
            "<br>" +
            "<p>Thanks again for visiting!</p>" +
            "<br>" +
            "<p>Best Regards,</p>" +
            "<br>" +
            "<p>UWO TEAM</p>" +
            "<p>"+d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() +"<p>" +
            "<br>" +
            "<p>if you have any question, please visit the Support Page (http://uwotrip.com/contact)</p>"



        var mailOptions = {
            from: 'Uwo Trip <noreply@uwotrip.com>', // sender address
            to: email, // list of receivers
            subject: 'Email Verifcation - Uwo Trip ✔', // Subject line
            html: content// html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }

            console.log('Message sent: ' + info.response);
        });

    },
    sendForgotPasswordMail: function (email, password) {
        console.log(email);
        var mailOptions = {
            from: 'Uwo Trip <noreply@uwotrip.com>', // sender address
            to: email, // list of receivers
            subject: 'Forgot Password - Uwo Trip ✔', // Subject line
            text: 'Your new temporary password is: ' + password, // plaintext body
            html: '<b>Your new temporary password is: </b>' + password // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }

            console.log('Message sent: ' + info.response);
        });

        //createUser(phone, password);

    },
    sendVerficationCode : function (phone, code){
        createUser(phone, code);
    },
    createHash: function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    },
    newNotification: function (notifications, content, url, type) {
        notifications.unshift({
            type: type || 'default',
            content: content || '',
            url: url || '',
            read: false
        });
    },
    isValidPassword: function (user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}