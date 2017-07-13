var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/User');
var bCrypt = require('bcrypt-nodejs');
var utils = require('../utils');

module.exports = function (passport) {
    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, email, password, done) {
            console.log("here I am");

             function login() {



                console.log("confirm email is good to be uesd : " + email);
                User.find({}, function(err, user){
                    console.log(user);
                });


                User.findOne({'email': email},
                    function (err, user) {

                        if (err) {
                            return done(err);
                        }
                        console.log(req.header('referer'));
                        req.session.returnTo = utils.getParameterByName('r', req.header('referer'));
                        console.log(req.session.returnTo);
                        req.session.rememberme = req.param('remember');
                         console.log(req.flash);
                         console.log(utils.isValidPassword(user, password));
                        if (!user || !utils.isValidPassword(user, password)) {
                            console.log("bearkpoint");
                            req.flash('loginMessage', 'invalid password');
                            return req.res.redirect(req.session.returnTo ? '/?r=' + req.session.returnTo + '#login' : '/#login');
                        }
                        console.log("welcome!");
                      
                        console.log(user);
                        return done(null, user);
                    }
                );
            }

            process.nextTick(login);
            
        })
    );
}