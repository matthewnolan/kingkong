var express = require('express');
var api = express.Router();
var slotInit = require('./requests/slotInit');
var spinNoWin1 = require('./requests/spin1');
var spinNoWin2 = require('./requests/spin2');
var spinWin1 = require('./requests/spin3');

/*
 How to determine gaffee details
 Go here:
 https://qa1h5c.h5c.co/Social/index.php?qs=&originId=2&accountTypeId=1&soslog=localhost:4444

 You’ll have to login. Please use these creds:
 rmg1@rmg.com / rmg123456
 */

//gaffes
var gaffe_line_m1 = require('./requests/gaffe_line_m1');
var gaffe_line_m2 = require('./requests/gaffe_line_m2');
var gaffe_line_m3 = require('./requests/gaffe_line_m3');
var gaffe_line_m4 = require('./requests/gaffe_line_m4');
var gaffe_m1_3x3  = require('./requests/gaffe_m1_3x3');
var gaffe_m1_3x4  = require('./requests/gaffe_m1_3x4');
var gaffe_m1_3x5  = require('./requests/gaffe_m1_3x5');
var gaffe_m2_3x3  = require('./requests/gaffe_m2_3x3');
var gaffe_m2_3x4  = require('./requests/gaffe_m2_3x4');
var gaffe_m2_3x5  = require('./requests/gaffe_m2_3x5');
var gaffe_m3_3x3  = require('./requests/gaffe_m3_3x3');
var gaffe_m3_3x4  = require('./requests/gaffe_m3_3x4');
var gaffe_m3_3x5  = require('./requests/gaffe_m3_3x5');
var gaffe_m4_3x3  = require('./requests/gaffe_m4_3x3');
var gaffe_m4_3x4  = require('./requests/gaffe_m4_3x4');
var gaffe_m4_3x5  = require('./requests/gaffe_m4_3x5');
var gaffe_ww_3x3  = require('./requests/gaffe_ww_3x3');
var gaffe_ww_3x4  = require('./requests/gaffe_ww_3x4');
var gaffe_ww_3x5  = require('./requests/gaffe_ww_3x5');
var gaffe_f5_3x3  = require('./requests/gaffe_f5_3x3');
var gaffe_f5_3x4  = require('./requests/gaffe_f5_3x4');
var gaffe_f5_3x5  = require('./requests/gaffe_f5_3x5');
var gaffe_f6_3x3  = require('./requests/gaffe_f6_3x3');
var gaffe_f6_3x4  = require('./requests/gaffe_f6_3x4');
var gaffe_f6_3x5  = require('./requests/gaffe_f6_3x5');
var gaffe_f7_3x3  = require('./requests/gaffe_f7_3x3');
var gaffe_f7_3x4  = require('./requests/gaffe_f7_3x4');
var gaffe_f7_3x5  = require('./requests/gaffe_f7_3x5');
var gaffe_f0 	 = require('./requests/gaffe_f0');
var gaffe_f5 	 = require('./requests/gaffe_f5');
var gaffe_f6 	 = require('./requests/gaffe_f6');
var gaffe_f7 	 = require('./requests/gaffe_f7');
var gaffe_f8 	 = require('./requests/gaffe_f9');
var gaffe_f9 	 = require('./requests/gaffe_f9');


api.use(function(req, res, next) {
	next();
});

api.get('/slot-init', function(req, res) {
	res.json(slotInit);
});

// Hardcoded Mock Gaffe Requests todo: Replace with real server gaffeing
api.get('/gaffe_line_m1', function(req, res) {
	gaffe_line_m1.origin.spinRecords = gaffe_line_m1.spinRecords;
	gaffe_line_m1.origin.spinRecords[0].stops = [0,0,0,0,0];
	res.json(gaffe_line_m1.origin);
});

api.get('/gaffe_line_m2', function(req, res) {
	gaffe_line_m2.origin.spinRecords = gaffe_line_m2.spinRecords;
	gaffe_line_m2.origin.spinRecords[0].stops = [54,68,48,46,58];
	res.json(gaffe_line_m2.origin);
});

api.get('/gaffe_line_m3', function(req, res) {
	gaffe_line_m3.origin.spinRecords = gaffe_line_m3.spinRecords;
	gaffe_line_m3.origin.spinRecords[0].stops = [52, 64, 87, 47, 48];
	console.log('gaffeLine_m3', gaffe_line_m3);
	res.json(gaffe_line_m3.origin);
});

api.get('/gaffe_line_m4', function(req, res) {
	gaffe_line_m4.origin.spinRecords = gaffe_line_m4.spinRecords;
	gaffe_line_m4.origin.spinRecords[0].stops = [65, 62, 55, 65, 63];
	res.json(gaffe_line_m4.origin);
});

api.get('/gaffe_m1_3x3', function(req, res) {
	gaffe_m1_3x3.origin.spinRecords = gaffe_m1_3x3.spinRecords;
	gaffe_m1_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m1_3x3.origin);
});

api.get('/gaffe_m1_3x4', function(req, res) {
	gaffe_m1_3x4.origin.spinRecords = gaffe_m1_3x4.spinRecords;
	gaffe_m1_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m1_3x4.origin);
});

api.get('/gaffe_m1_3x5', function(req, res) {
	gaffe_m1_3x5.origin.spinRecords = gaffe_m1_3x5.spinRecords;
	gaffe_m1_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m1_3x5.origin);
});

api.get('/gaffe_m2_3x3', function(req, res) {
	gaffe_m2_3x3.origin.spinRecords = gaffe_m2_3x3.spinRecords;
	gaffe_m2_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m2_3x3.origin);
});

api.get('/gaffe_m2_3x4', function(req, res) {
	gaffe_m2_3x4.origin.spinRecords = gaffe_m2_3x4.spinRecords;
	gaffe_m2_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m2_3x4.origin);
});

api.get('/gaffe_m2_3x5', function(req, res) {
	gaffe_m2_3x5.origin.spinRecords = gaffe_m2_3x5.spinRecords;
	gaffe_m2_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m2_3x5.origin);
});

api.get('/gaffe_m3_3x3', function(req, res) {
	gaffe_m3_3x3.origin.spinRecords = gaffe_m3_3x3.spinRecords;
	gaffe_m3_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m3_3x3.origin);
});

api.get('/gaffe_m3_3x4', function(req, res) {
	gaffe_m3_3x4.origin.spinRecords = gaffe_m3_3x4.spinRecords;
	gaffe_m3_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m3_3x4.origin);
});

api.get('/gaffe_m3_3x5', function(req, res) {
	gaffe_m3_3x5.origin.spinRecords = gaffe_m3_3x5.spinRecords;
	gaffe_m3_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m3_3x5.origin);
});

api.get('/gaffe_m4_3x3', function(req, res) {
	gaffe_m4_3x3.origin.spinRecords = gaffe_m4_3x3.spinRecords;
	gaffe_m4_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m4_3x3.origin);
});

api.get('/gaffe_m4_3x4', function(req, res) {
	gaffe_m4_3x4.origin.spinRecords = gaffe_m4_3x4.spinRecords;
	gaffe_m4_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m4_3x4.origin);
});

api.get('/gaffe_m4_3x5', function(req, res) {
	gaffe_m4_3x5.origin.spinRecords = gaffe_m4_3x5.spinRecords;
	gaffe_m4_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_m4_3x5.origin);
});

api.get('/gaffe_ww_3x3', function(req, res) {
	gaffe_ww_3x3.origin.spinRecords = gaffe_ww_3x3.spinRecords;
	gaffe_ww_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_ww_3x3.origin);
});

api.get('/gaffe_ww_3x4', function(req, res) {
	gaffe_ww_3x4.origin.spinRecords = gaffe_ww_3x4.spinRecords;
	gaffe_ww_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_ww_3x4.origin);
});

api.get('/gaffe_ww_3x5', function(req, res) {
	gaffe_ww_3x5.origin.spinRecords = gaffe_ww_3x5.spinRecords;
	gaffe_ww_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_ww_3x5.origin);
});

api.get('/gaffe_f5_3x3', function(req, res) {
	gaffe_f5_3x3.origin.spinRecords = gaffe_f5_3x3.spinRecords;
	gaffe_f5_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f5_3x3.origin);
});

api.get('/gaffe_f5_3x4', function(req, res) {
	gaffe_f5_3x4.origin.spinRecords = gaffe_f5_3x4.spinRecords;
	gaffe_f5_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f5_3x4.origin);
});

api.get('/gaffe_f5_3x5', function(req, res) {
	gaffe_f5_3x5.origin.spinRecords = gaffe_f5_3x5.spinRecords;
	gaffe_f5_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f5_3x5.origin);
});

api.get('/gaffe_f6_3x3', function(req, res) {
	gaffe_f6_3x3.origin.spinRecords = gaffe_f6_3x3.spinRecords;
	gaffe_f6_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f6_3x3.origin);
});

api.get('/gaffe_f6_3x4', function(req, res) {
	gaffe_f6_3x4.origin.spinRecords = gaffe_f6_3x4.spinRecords;
	gaffe_f6_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f6_3x4.origin);
});

api.get('/gaffe_f6_3x5', function(req, res) {
	gaffe_f6_3x5.origin.spinRecords = gaffe_f6_3x5.spinRecords;
	gaffe_f6_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f6_3x5.origin);
});

api.get('/gaffe_f7_3x3', function(req, res) {
	gaffe_f7_3x3.origin.spinRecords = gaffe_f7_3x3.spinRecords;
	gaffe_f7_3x3.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f7_3x3.origin);
});

api.get('/gaffe_f7_3x4', function(req, res) {
	gaffe_f7_3x4.origin.spinRecords = gaffe_f7_3x4.spinRecords;
	gaffe_f7_3x4.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f7_3x4.origin);
});

api.get('/gaffe_f7_3x5', function(req, res) {
	gaffe_f7_3x5.origin.spinRecords = gaffe_f7_3x5.spinRecords;
	gaffe_f7_3x5.origin.spinRecords[0].stops = [0, 0, 0, 0, 0];
	res.json(gaffe_f7_3x5.origin);
});

api.get('/gaffe_f0', function(req, res) {
	gaffe_f0.origin.spinRecords = gaffe_f0.spinRecords;
	gaffe_f0.origin.spinRecords[0].stops = [82, 46, 58, 57, 45];
	res.json(gaffe_f0.origin);
});

api.get('/gaffe_f5', function(req, res) {
	gaffe_f5.origin.spinRecords = gaffe_f5.spinRecords;
	gaffe_f5.origin.spinRecords[0].stops = [65, 62, 55, 65, 63];
	res.json(gaffe_f5.origin);
});

api.get('/gaffe_f6', function(req, res) {
	gaffe_f6.origin.spinRecords = gaffe_f6.spinRecords;
	gaffe_f6.origin.spinRecords[0].stops = [49, 45, 67, 66, 57];
	res.json(gaffe_f6.origin);
});

api.get('/gaffe_f7', function(req, res) {
	gaffe_f7.origin.spinRecords = gaffe_f7.spinRecords;
	gaffe_f7.origin.spinRecords[0].stops = [46, 63, 47, 51, 46];
	res.json(gaffe_f7.origin);
});

api.get('/gaffe_f8', function(req, res) {
	gaffe_f8.origin.spinRecords = gaffe_f8.spinRecords;
	gaffe_f8.origin.spinRecords[0].stops = [47, 49, 60, 48, 61];
	res.json(gaffe_f8.origin);
});

api.get('/gaffe_f9', function(req, res) {
	gaffe_f9.origin.spinRecords = gaffe_f9.spinRecords;
	gaffe_f9.origin.spinRecords[0].stops = [47, 49, 60, 48, 61];
	res.json(gaffe_f9.origin);
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
