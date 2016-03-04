var express      = require('express');
var fs           = require('fs');
var path         = require('path');
var libUrl       = require('url');
// var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('cookie-session');
var bodyParser   = require('body-parser');
var async        = require('async');
var app          = express();
var isDev        = "development" == app.get('env');

var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var compiler = webpack(require('./webpack.config.js'));
app.use(webpackDevMiddleware(compiler, {
    stats:{colors:true}
}));

express.UserConfig = require('./config');
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
// app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// if(isDev) app.use(require('node-compass')({mode:'compressed', css:'css', sass:'scss', img:'img'}));
if(isDev){
	app.use(express.UserConfig.compileSCSS);
	app.use(express.UserConfig.compileTemplate);
}
app.use(express.UserConfig.combo);
app.use(express['static'](path.join(__dirname, express.UserConfig.staticDir)));
app.locals.__version__ = '20150821017';
app.use(session({name:'_SSID_', keys:['skey1', 'skey2']}));

//async series{{{
async.series([
	function(){
		express.UserConfig.routes(app, path.join(__dirname, 'routes'), '/');
	}, 
	function(){
		/// catch 404 and forward to error handler
		app.use(function(req, res, next) {
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		});

		/// error handlers

		// development error handler
		// will print stacktrace
		if (app.get('env') === 'development') {
			app.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.render('error', {
					message: err.message,
					error: err
				});
			});
		}

		// production error handler
		// no stacktraces leaked to user
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: {}
			});
		});
	}
]);
//}}}
module.exports = app;
/* vim:set fdm=marker tabstop=4 shiftwidth=4 softtabstop=4: */
