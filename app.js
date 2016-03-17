var express              = require('express');
var fs                   = require('fs');
var path                 = require('path');
var libUrl               = require('url');
var logger               = require('morgan');
var cookieParser         = require('cookie-parser');
var session              = require('cookie-session');
var bodyParser           = require('body-parser');
var app                  = express();
var isDev                = "development"===app.get('env');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack              = require("webpack");
var compiler             = webpack(require('./webpack.config.js'));
app.use(webpackDevMiddleware(compiler, {
    stats:{colors:true}
}));

express.UserConfig = require('./config');
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
if(isDev){
	app.use(express.UserConfig.compileSCSS);
	app.use(express.UserConfig.compileTemplate);
}
app.use(express.UserConfig.staticHttpCombo);
app.locals.__version__ = '20150821017';
app.use(session({name:'_SSID_', keys:['skey1', 'skey2']}));

Promise.resolve(new Promise(function(resolve, reject){
	express.UserConfig.autoAddRoutes(app, path.join(__dirname, 'routes'), '/', {resolve:resolve, reject:reject});
})).then(function(){
	app.use(express['static'](path.join(__dirname, express.UserConfig.staticDir), {index:'______.html'}));
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	app.use(function(err, req, res, next) {
		var status = err.status || 500;
		res.status(status);
		res.render(status, {
			message:err.message,
			error:{}
		});
	});
});
module.exports = app;
/* vim:set fdm=marker tabstop=4 shiftwidth=4 softtabstop=4: */
