var express = require('express');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('../config/utils');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function () {
    router.get('/checkUnique', utils.isAuthenticated, function(req, res){
        res.send( {result: utils.check_unique(req.query.email, req.query.phonenumber)} );
    });

	return router;
}