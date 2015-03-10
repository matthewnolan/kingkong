var express = require('express');
var api = express.Router();
var slotInit = require('./requests/SlotInit');
var spinNoWin1 = require('./requests/spin1');
var spinNoWin2 = require('./requests/spin2');


api.use(function(req, res, next) {
	next();
});

api.get('/slot-init', function(req, res) {
	res.json(slotInit);
});

api.get('/spin-no-win1', function(req, res) {
	res.json(spinNoWin1);
});

api.get('/random-spin', function(req, res) {
	var spins = [spinNoWin1, spinNoWin2];
	var resp = spins[Math.floor(Math.random() * spins.length)]
	res.json(resp);
});

module.exports.api = api;
