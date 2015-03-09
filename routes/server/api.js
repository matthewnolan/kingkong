var express = require('express');
var api = express.Router();
var slotInit = require('./requests/slotInit');
var spinNoWin1 = require('./requests/spin');


api.use(function(req, res, next) {
	next();
});

api.get('/slot-init', function(req, res) {
	res.json(slotInit);
});

api.get('/spin-no-win1',function(req, res) {
	res.json(spinNoWin1);
});

module.exports.api = api;
