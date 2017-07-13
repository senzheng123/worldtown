var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
//console.log("hey there");
    passport.use('register', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, password, done) {
            console.log(req.body);

            console.log("hey there");
            function findOrCreateUser() {


                
                var query = {
                    $or: [
                        {'phonenumber': req.param('phonenumber')}, {'email': req.param('email')}
                    ]
                };

                

                User.findOne(query, function (err, user) {

                    if (err || user) {

                        req.flash('registerMessage', 'User already exists.');

                        return req.res.redirect('/#register');

                    }
                    // basic info for both user and serviceprovider

                    console.log("here is the register!");

                    var newUser = new User();

                    newUser.username = null;

                    newUser.password = createHash(password);

                    newUser.fisrtname = req.param('fisrtname');

                    newUser.lastname = req.param('lastname');

                    newUser.phonenumber = req.param('phonenumber');

                    newUser.saddress = req.param('businessaddress');

                    newUser.businessname = req.param('businessname');

                    newUser.city = req.param('city');

                    newUser.states = req.param('states');

                    newUser.zip = req.param('zip');


                    newUser.save(function (err) {

                            if (err) {

                                throw err;

                            }

                            return done(null, newUser);

                        });

                });

            };

            process.nextTick(findOrCreateUser);
        })
    );
}

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}