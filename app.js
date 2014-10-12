var express      = require('express');
var fs           = require('fs');
var path         = require('path');
var libUrl       = require( 'url' );
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('cookie-session');
var bodyParser   = require('body-parser');
var async        = require('async');
var app          = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('node-compass')({mode:'compressed', css:'css', sass:'sass', img:'img'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({name:'_SSID_', keys:['skey1', 'skey2'], secureProxy:false}));

// UserConfig {{{
var mkdirRecursive = function(dirpath, mode, callback) {
	path.exists(dirpath, function(exists) {
		if(exists) {
			callback(dirpath);
		} else {
			mkdirRecursive(path.dirname(dirpath), mode, function(){
				fs.mkdir(dirpath, mode, callback);
			});
		}
	});
};
express.UserConfig = {
	routes : function(dirPath, routePath){
		var routeFiles = fs.readdirSync(dirPath);
		routeFiles.forEach(function(file){
			fs.stat(dirPath + '/' + file, function(err, stats){
				if( stats.isDirectory() ){
					express.UserConfig.routes(dirPath + '/' + file, routePath+file+'/');
				}else if( stats.isFile() ){
					var list = file.split('.');
					if(list.length==2 && list[1]==='js'){
						var name = list[0],
							path = routePath + name,
							module = './routes' + path;

						console.log("Auto add route!\n\tPath: ", path, '\n\tModule: ', module);
						app.use('/', require(module));
					}
				}
			});
		});
	},
	dist: function(err, ret){
		var req = this.req;
		// console.log(req);
		if(req.query.dist=='1'){
			var url_path = req.route.path.replace(/^\/|\/$/g, '');
			url_path = process.cwd() + '/public/html/' + (url_path || 'index') + '.html';
			mkdirRecursive(path.dirname(url_path), 777, function(){
				fs.writeFile(url_path, ret, function(err){
					if(err) throw err;
					console.log('Dist ' + url_path + ' succeed!');
				});
			});
		}
		this.res.send(ret);
	}
};
//}}}

//async series{{{
async.series([
	function(){
		express.UserConfig.routes(path.join(__dirname, 'routes'), '/');
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

/* vim: set fdm=marker tabstop=4 shiftwidth=4 softtabstop=4: */
