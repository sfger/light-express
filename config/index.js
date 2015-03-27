var fs     = require('fs');
var path   = require('path');
var isDev  = false;
var config = {
	staticDir: 'public',
	routes: function(app, dirPath, routePath){
		var routeFiles = fs.readdirSync(dirPath);
		routeFiles.forEach(function(file){
			fs.stat(dirPath+'/'+file, function(err, stats){
				if( stats.isDirectory() ){
					config.routes(app, dirPath+'/'+file, routePath+file+'/');
				}else if( stats.isFile() ){
					var list = file.split('.');
					if(list.length==2 && list[1]==='js'){
						var name   = list[0],
							path   = routePath + name,
							module = '/routes' + path;
						isDev  = "development" == app.get('env');
						if(isDev){
							console.log("Auto add route!\n\tPath: ", path, '\n\tModule: ', module);
						}
						app.use('/', require('..'+module));
					}
				}
			});
		});
	},
	dist: function(err, ret){
		var req = this.req;
		// console.log(config);
		ret = config.minifyHTML(ret);
		if(req.query.dist=='1'){
			config.writeStaticCache(this.distPath || req.route.path, ret);
		}
		this.res.send(ret);
	},
	minifyHTML: function(str){
		// console.log(str);
		str = str.replace(/(\/?>)\s+|\s+(?=<)/g, '$1')
		.replace(/\s*([\r\n]+)\s*/g, '$1');
		return str;
	},
	writeStaticCache: function(url, ret){
		// console.log(url);
		if(typeof url == 'object' && url.length) url = url[0];
		var url_path = url.replace(/^\/|\/$/g, '');
		url_path = process.cwd() + '/' + config.staticDir + '/html/' + (url_path || 'index') + '.html';
		url_path = path.normalize(url_path);
		config.mkdirRecursive(path.dirname(url_path), 777, function(){
			fs.writeFile(url_path, ret, function(err){
				if(err) throw err;
				if(isDev){
					console.log('Dist ' + url_path + ' succeed!');
				}
			});
		});
	},
	mkdirRecursive: function(dirpath, mode, callback) {
		var that = this;
		fs.exists(dirpath, function(exists) {
			if(exists){
				callback(dirpath);
			}else{
				that.mkdirRecursive(path.dirname(dirpath), mode, function(){
					fs.mkdir(dirpath, mode, callback);
				});
			}
		});
	},
	compileSCSS: function(req, res, next){
		if(/.*\.css$/.test(req.path)){
			var static_public = process.cwd() + '/../../public';
			static_public = path.normalize(static_public);
			var css_path = static_public +  req.path.replace(/\.css/, '');
			css_path = path.normalize(css_path);
			config.mkdirRecursive(path.dirname(css_path), 777, function(){
				var out_file = css_path + '.css';
				var in_file = css_path.replace(/([\\\/])css([\\\/])/, "$1scss$2") + '.scss';
				var sh = [
					'scss',
					'--sourcemap=none',
					'-t compressed',
					'-I ' + static_public + '/public/scss',
					in_file,
					out_file
				];
				// console.log(sh.join(' '));
				exec(sh.join(' '), function(error, stdout, stderr){
					 // console.log(error);
					 // console.log(stdout);
					 // console.log(stderr);
					return next();
				});
			});
		}else{
			return next();
		}
	},
	compileTemplate: function(req, res, next){
		if(/^\/[^\/]*\/tpl\/.*\.js/.test(req.path)){
			var static_public = process.cwd() + '/../../public';
			static_public = path.normalize(static_public);
			var js_path = static_public + req.path.replace(/\.js/, '');
			js_path = path.normalize(js_path);
			var minify_code = function(s){
				s = s.replace(/(\/?>)\s+|\s+(?=<)/g, '$1');
				// s = s.replace(/\\/g, "\\\\");
				s = s.replace(/\s*([\r\n]+)\s*/g, '$1');
				// s = s.replace(/([^\\])(')/g, "$1\\$2"); // '
				return s;
			}
			config.mkdirRecursive(path.dirname(js_path), 777, function(){
				var out_file = js_path + '.js';
				var data;
				var in_file;
				if(req.query.stpl){
					var stpl = req.query.stpl.split(',');
					data = {};
					stpl.forEach(function(one, i){
						in_file = String(path.dirname(js_path) + '/').replace(/([\\\/])tpl([\\\/])/, "$1htpl$2") + one + '.tpl';
						var s = fs.readFileSync(in_file, {encoding:'utf8', flag: 'r'});
						s = minify_code(s);
						data[one] = s;
					});
					data = "define('" + path.basename(req.path, ".js") + "'," + JSON.stringify(data) + ");";
				}else{
					in_file = js_path.replace(/([\\\/])tpl([\\\/])/, "$1htpl$2") + '.tpl';
					data = fs.readFileSync(in_file, {encoding:'utf8', flag: 'r'});
					data = minify_code(data);
					data = "define('" + path.basename(in_file, ".tpl") + "'," + JSON.stringify(data) + ");";
				}
				fs.writeFile(out_file, data, {mode:'777'}, function(){
					return next();
				});
			});
		}else{
			return next();
		}
	}
};
module.exports = config;
