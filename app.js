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
var webpackDev = require("webpack-dev-middleware");
var webpack    = require("webpack");
var compiler   = webpack(require('./webpack.config.js'));
var Extension  = require('./extension');
app.use(webpackDev(compiler, {
	stats:{colors:true}
}));

app.Extension = Extension;
app.set('views', Extension.view_dir);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie());
// app.locals.__version__ = '__version__';
app.use(session({name:'_SSID_', keys:['skey1', 'skey2']}));

new Promise((resolve, reject) => {
	app.use(logger('dev'));
	app.use(Extension.CompileSCSS);
	app.use(Extension.Compile2JS);
	app.use(Extension.staticHttpCombo);
	Extension.autoAddRoutes(app, Extension.route_dir, '/', {resolve, reject});
}).then(() => {
	app.use(express.static(Extension.static_dir, {
		index:'index.html'
	}));
	app.use((req, res, next) => {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	app.use((err, req, res/*, next*/) => {
		var status = err.status || 500;
		res.status(status);
		res.render(status, {
			message:err.message,
			error:{}
		});
	});
}).catch(function(err){
	console.log(err);
});
module.exports = app;
/* vim:set fdm=marker tabstop=4 shiftwidth=4 softtabstop=4: */
