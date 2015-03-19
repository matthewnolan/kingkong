var express = require('express');
var api = express.Router();
var slotInit = require('./requests/SlotInit');
var spinNoWin1 = require('./requests/spin1');
var spinNoWin2 = require('./requests/spin2');
var spinWin1 = require('./requests/spin3');

//gaffs
var gaff_line_m1 = require('./requests/gaff_line_m1');
var gaff_line_m2 = require('./requests/gaff_line_m2');
var gaff_line_m3 = require('./requests/gaff_line_m3');
var gaff_line_m4 = require('./requests/gaff_line_m4');
var gaff_m1_3x3  = require('./requests/gaff_m1_3x3');
var gaff_m1_3x4  = require('./requests/gaff_m1_3x4');
var gaff_m1_3x5  = require('./requests/gaff_m1_3x5');
var gaff_m2_3x3  = require('./requests/gaff_m2_3x3');
var gaff_m2_3x4  = require('./requests/gaff_m2_3x4');
var gaff_m2_3x5  = require('./requests/gaff_m2_3x5');
var gaff_m3_3x3  = require('./requests/gaff_m3_3x3');
var gaff_m3_3x4  = require('./requests/gaff_m3_3x4');
var gaff_m3_3x5  = require('./requests/gaff_m3_3x5');
var gaff_m4_3x3  = require('./requests/gaff_m4_3x3');
var gaff_m4_3x4  = require('./requests/gaff_m4_3x4');
var gaff_m4_3x5  = require('./requests/gaff_m4_3x5');
var gaff_ww_3x3  = require('./requests/gaff_ww_3x3');
var gaff_ww_3x4  = require('./requests/gaff_ww_3x4');
var gaff_ww_3x5  = require('./requests/gaff_ww_3x5');
var gaff_f5_3x3  = require('./requests/gaff_f5_3x3');
var gaff_f5_3x4  = require('./requests/gaff_f5_3x4');
var gaff_f5_3x5  = require('./requests/gaff_f5_3x5');
var gaff_f6_3x3  = require('./requests/gaff_f6_3x3');
var gaff_f6_3x4  = require('./requests/gaff_f6_3x4');
var gaff_f6_3x5  = require('./requests/gaff_f6_3x5');
var gaff_f7_3x3  = require('./requests/gaff_f7_3x3');
var gaff_f7_3x4  = require('./requests/gaff_f7_3x4');
var gaff_f7_3x5  = require('./requests/gaff_f7_3x5');
var gaff_f0 	 = require('./requests/gaff_f0');
var gaff_f5 	 = require('./requests/gaff_f5');
var gaff_f6 	 = require('./requests/gaff_f6');
var gaff_f7 	 = require('./requests/gaff_f7');
var gaff_f8 	 = require('./requests/gaff_f9');
var gaff_f9 	 = require('./requests/gaff_f9');


api.use(function(req, res, next) {
	next();
});

api.get('/slot-init', function(req, res) {
	res.json(slotInit);
});

// Hardcoded Mock Gaff Requests todo: Replace with real server gaffing
api.get('/gaff-line-m1', function(req, res) {
	gaff_line_m1.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_line_m1.origin);
});

api.get('/gaff-line-m2', function(req, res) {
	gaff_line_m2.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_line_m2.origin);
});

api.get('/gaff-line-m3', function(req, res) {
	gaff_line_m3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_line_m3.origin);
});

api.get('/gaff-line-m4', function(req, res) {
	gaff_line_m4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_line_m4.origin);
});

api.get('/gaff_m1_3x3', function(req, res) {
	gaff_m1_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m1_3x3.origin);
});

api.get('/gaff_m1_3x4', function(req, res) {
	gaff_m1_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m1_3x4.origin);
});

api.get('/gaff_m1_3x5', function(req, res) {
	gaff_m1_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m1_3x5.origin);
});

api.get('/gaff_m2_3x3', function(req, res) {
	gaff_m2_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m2_3x3.origin);
});

api.get('/gaff_m2_3x4', function(req, res) {
	gaff_m2_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m2_3x4.origin);
});

api.get('/gaff_m2_3x5', function(req, res) {
	gaff_m2_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m2_3x5.origin);
});

api.get('/gaff_m3_3x3', function(req, res) {
	gaff_m3_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m3_3x3.origin);
});

api.get('/gaff_m3_3x4', function(req, res) {
	gaff_m3_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m3_3x4.origin);
});

api.get('/gaff_m3_3x5', function(req, res) {
	gaff_m3_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m3_3x5.origin);
});

api.get('/gaff_m4_3x3', function(req, res) {
	gaff_m4_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m4_3x3.origin);
});

api.get('/gaff_m4_3x4', function(req, res) {
	gaff_m4_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m4_3x4.origin);
});

api.get('/gaff_m4_3x5', function(req, res) {
	gaff_m4_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_m4_3x5.origin);
});

api.get('/gaff_ww_3x3', function(req, res) {
	gaff_ww_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_ww_3x3.origin);
});

api.get('/gaff_ww_3x4', function(req, res) {
	gaff_ww_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_ww_3x4.origin);
});

api.get('/gaff_ww_3x5', function(req, res) {
	gaff_ww_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_ww_3x5.origin);
});

api.get('/gaff_f5_3x3', function(req, res) {
	gaff_f5_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f5_3x3.origin);
});

api.get('/gaff_f5_3x4', function(req, res) {
	gaff_f5_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f5_3x4.origin);
});

api.get('/gaff_f5_3x5', function(req, res) {
	gaff_f5_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f5_3x5.origin);
});

api.get('/gaff_f6_3x3', function(req, res) {
	gaff_f6_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f6_3x3.origin);
});

api.get('/gaff_f6_3x4', function(req, res) {
	gaff_f6_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f6_3x4.origin);
});

api.get('/gaff_f6_3x5', function(req, res) {
	gaff_f6_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f6_3x5.origin);
});

api.get('/gaff_f7_3x3', function(req, res) {
	gaff_f7_3x3.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f7_3x3.origin);
});

api.get('/gaff_f7_3x4', function(req, res) {
	gaff_f7_3x4.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f7_3x4.origin);
});

api.get('/gaff_f7_3x5', function(req, res) {
	gaff_f7_3x5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f7_3x5.origin);
});

api.get('/gaff_f0', function(req, res) {
	gaff_f0.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f0.origin);
});

api.get('/gaff_f5', function(req, res) {
	gaff_f5.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f5.origin);
});

api.get('/gaff_f6', function(req, res) {
	gaff_f6.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f6.origin);
});

api.get('/gaff_f7', function(req, res) {
	gaff_f7.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f7.origin);
});

api.get('/gaff_f8', function(req, res) {
	gaff_f8.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f8.origin);
});

api.get('/gaff_f9', function(req, res) {
	gaff_f9.origin.spinRecords = gaff.spinRecords;
	res.json(gaff_f9.origin);
});










api.get('/spin-no-win1', function(req, res) {
	res.json(spinNoWin1);
});

api.get('/random-spin', function(req, res) {
	var spins = [spinNoWin1, spinNoWin2, spinWin1];
	//var spins = [];
	var resp = spins[Math.floor(Math.random() * spins.length)];
	res.json(resp);
});


module.exports.api = api;
