var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var index = require('./routes/index');
var user = require('./routes/user');
var mongoose = require('mongoose');
var config = require('./config/config');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var flash = require('connect-flash');
var compression = require('compression');



var app = express();
app.use(compression());

mongoose.connect('mongodb://ec2-13-59-214-11.us-east-2.compute.amazonaws.com:27017/superbear');

app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.urlencoded({
    limit: '5mb'
}));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.engine('jade', require('jade').__express);
app.engine('ejs', require('ejs').renderFile); 
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    secret: config.secret,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use(flash());




var initPassport = require('./config/passport/init');
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
        res.locals.user = req.user;
        res.locals.path = req.path;
        next();
    
});


app.use('/', index);

app.use(require('./routes/user')(passport));
app.use(require('./routes/serviceprovider')());
app.use(require('./routes/common')());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});





// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
