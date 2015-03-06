var express = require('express');
var api = express.Router();
var SlotInit = require('./requests/SlotInit');

api.use(function(req, res, next) {
	next();
});

api.get('/slot-init', function(req, res) {
	res.json(SlotInit);
});

module.exports.api = api;
