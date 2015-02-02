var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// uncomment to enable routes
//var routes = require('./routes/index');

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', require('ejs').renderFile);
// view engine setup

app.set('view engine', 'html');
app.set('view options', { layout: false });
app.set('views', path.join(__dirname, 'views/'));

var sendIndex = function (req, res) {
	res.sendfile(__dirname + "/public/index.html");
};

var sendTests = function(req, res) {
	res.sendfile(__dirname + "/public/tests.html");
};

var sendClassStructure = function(req, res) {
	res.sendfile(__dirname + "/src/architecture/ClassStructure.pdf");
}

app.get('/', sendIndex);
app.get('/test', sendTests);
app.get('/tests', sendTests);
app.get('/classes', sendClassStructure);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});


module.exports = app;
