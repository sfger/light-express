/* eslint comma-dangle:1 */
/* eslint-disable */
/* eslint-enable */
/* eslint-disable comma-dangle */
/* eslint-enable comma-dangle */

var express    = require('express');
var app        = express();
var logger     = require('morgan');
var cookie     = require('cookie-parser');
var session    = require('cookie-session');
var bodyParser = require('body-parser');
var Extension  = require('./extension');
app.Extension  = Extension;
app.use(Extension.webpackDev);
app.set('views', Extension.view_dir);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookie());
// app.locals.__version__ = '__version__';
app.use(session({name:'_SSID_', keys:['skey1', 'skey2']}));
app.use(logger('dev'));

new Promise((resolve, reject) => {
	app.use(express.static(Extension.static_dir, {
		index:'index.html'
	}));
	app.use(Extension.CompileSCSS);
	app.use(Extension.Compile2JS);
	app.use(Extension.staticHttpCombo);
	Extension.autoAddRoutes(app, Extension.route_dir, '/', {resolve, reject});
}).then(() => {
	app.use((req, res, next) => {
		let err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	app.use((err, req, res, next) => {
		console.log('ERROR:', err);
		let status = String(err.status || 500);
		next && res.status(status).render(status, {
			message:err.message,
			error:err
		});
	});
}).catch(function(err){
	console.log('Global Error', err);
});
module.exports = app;
/* vim:set fdm=marker tabstop=4 shiftwidth=4 softtabstop=4: */
