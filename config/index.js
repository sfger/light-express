var fs      = require('fs');
var exec    = require('child_process').exec;
var path    = require('path');
var sass    = require('node-sass');
var isDev   = false;
var postcss = require('postcss');
var config  = {
	staticDir: '/public',

	map_combo_file: {
		'/sfger/js/case/seaShell/_test_.js' : 'data.js,data.js'
	},

	readJSONFile: function(p){
		var json = {};
		try{
			p = path.normalize(p);
			// var ret = fs.readFileSync(p, {encoding:'utf8', flag: 'r'});
			// json = JSON.parse(ret);
			delete require.cache[require.resolve(p)];
			json = require(p);
		}catch(e){
			console.log(e);
		}
		return json;
	},

	get_combo_file_list: function(file){
		var files = config.map_combo_file[file].split(',');
		var static_public = process.cwd() + '/' + config.staticDir;
		return files.map(function(one){
			return path.normalize(static_public + path.dirname(file) + '/' + one);
		});
	},

	pipe_stream_list_to_writer: function(list, writer){
		var get_read_stream_iterator = function*(){
			for(var i=0,il=list.length; i<il; i++){
				yield fs.createReadStream(list[i], {autoClose:false});
			}
		};
		var pipe_data = function(iterator){
			var item = iterator.next();
			if(!item.done){
				item = item.value;
				try{
					item.pipe(writer, {end:false});
					item.on('end', ()=>{
						pipe_data(iterator);
					});
				}catch(e){
					console.log(e);
					return next();
				}
			}else{
				writer.end('');
			}
		}
		var iterator = get_read_stream_iterator();

		pipe_data(iterator);
		return true;
	},

	/*
	 * 简单的http2.0 combo处理，未做304等状态处理，只供开发使用
	 * */
	httpCombo: function(req, res, next){
		var static_public = path.normalize(process.cwd() + '/' + config.staticDir);

		if(req.path in config.map_combo_file){
			config.pipe_stream_list_to_writer(config.get_combo_file_list(req.path), res);
			return false;
		}
		if(/\?\?/.test(req.originalUrl)){
			var i = req.originalUrl.indexOf('??');
			var file_list = req.originalUrl.slice(i+2).split('?')[0].split(',');
			var ret = '';
			var type = file_list[file_list.length-1].split('.').reverse()[0];
			var types = {
				"js": "application/x-javascript",
				"css": "text/css"
			};
			if(type==='js' || type==='css'){
				// 跳转，如：http://localhost/public/js??jquery-min.js,jquery-window.js?_a=1&v=201502110322
				//        => http://localhost/public/js/??jquery-min.js,jquery-window.js?_a=1&v=201502110322
				if(req.path[req.path.length-1]!=='/'){
					res.redirect(req.originalUrl.replace(/\?\?/, '/??'));
					// res.writeHead(302);
					return res.end('');
				}
			}else{ //暂时支付css和js，其它暂时没必要处理
				return next();
			}

			var list = [];
			file_list.forEach(function(one){
				var file = req.path + one;
				if(config.map_combo_file[file]){
					list = list.concat(config.get_combo_file_list(file));
				}else{
					list.push(path.normalize(static_public + file));
				}
			});
			res.writeHead(200, {"Content-Type":types[type]});
			config.pipe_stream_list_to_writer(list, res);
			return true;
		}else{
			return next();
		}
	},

	autoAddRoutes: function(app, dirPath, routePath, defer){
		var routeFiles = fs.readdirSync(dirPath);
		Promise.all(routeFiles.map(function(file){
			return new Promise(function(resolve, reject){
				fs.stat(dirPath+'/'+file, function(err, stats){
					if( stats.isDirectory() ){
						config.autoAddRoutes(app, dirPath+'/'+file, routePath+file+'/', {resolve:resolve, reject:reject});
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
						resolve();
					}else{
						resolve();
					}
				});
			});
		})).then(function(){
			defer.resolve();
		});
	},
	dist: function(err, ret){
		var req = this.req;
		// console.log(config);
		ret = config.minifyHTML(ret);
		if(req.query.dist!=='0'){
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
		url_path = process.cwd() + '/' + config.staticDir + '/' + (url_path || 'index') + '.html';
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
	mkdirRecursive: function(dirpath, mode, callback){
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
	sass: {
		ruby: function(in_file, out_file, lib, next){
			var sh = [
				'scss',
				'--sourcemap=none',
				'-t compressed',
				// '-I ' + lib,
				in_file,
				out_file
			];
			console.log(sh.join(' '));
			exec(sh.join(' '), function(error, stdout, stderr){
				console.log(error);
				console.log(stdout);
				console.log(stderr);
				return next();
			});
		},
		node: function(in_file, out_file, lib, res){
			sass.render({
				// data      : 'body{background:blue; a{color:black;}}',
				includePaths : lib,
				linefeed     : 'lf',
				file         : in_file,
				indentWidth  : 1,
				indentType   : 'tab',
				outputStyle  : 'compact'
			}, function(error, result){
				if(error){
					console.log(error);
					console.log(error.status);
					console.log(error.column);
					console.log(error.message);
					console.log(error.line);
				}else{
					postcss([
						// require('autoprefixer'),
						// require('postcss-sprites')({
						// 	stylesheetPath:path.dirname(out_file),
						// 	spritePath:out_file+'.sprite.png'
						// }),
						// require('postcss-easysprites')({
						// 	padding        : 1,
						// 	imagePath      : path.dirname(out_file) + '/../img',
						// 	stylesheetPath : path.dirname(out_file) + '/../css',
						// 	spritePath     : path.dirname(out_file) + '/../sprite'
						// }),
						require('postcss-image-inliner')({
							assetPaths:[path.dirname(out_file)],
							maxFileSize:20480
						}),
						require('precss')({}),
						require('postcss-urlrev')({})
					]).process(result.css, {
						from:in_file, to:out_file
					}).then(function(result){
						// console.log(result.css);
						fs.writeFile(out_file, result.css, {mode:'777'}, function(){
							console.log(`Compile ${out_file} success`);
							// return next();
						});
						res.writeHead(200, {"Content-Type":"text/css"});
						res.end(result.css);
					});
				}
			});
		}
	},
	compileSCSS: function(req, res, next){
		if(/.*\.css$/.test(req.path)){
			var static_public = process.cwd() + config.staticDir;
			static_public = path.normalize(static_public);
			var css_path = static_public +  req.path.replace(/\.css/, '');
			css_path = path.normalize(css_path);
			config.mkdirRecursive(path.dirname(css_path), 777, function(){
				var out_file = css_path + '.css';
				var in_file = css_path.replace(/([\\\/])css([\\\/])/, "$1scss$2") + '.scss';
				config.sass.node(in_file, out_file, [path.normalize(process.cwd()+'/public/sfger/scss')], res);
			});
		}else{
			return next();
		}
	},
	/*
	 * 每次请求模块文件时，动态编译相应的模块文件
	 * 具有合并多个模块文件为一个的功能
	 * */
	compileTemplate: function(req, res, next){
		if(/\/tpl\/.*\.js/.test(req.path)){
			var static_public = process.cwd() + config.staticDir;
			static_public = path.normalize(static_public);
			var js_path = static_public + req.path.replace(/\.js/, '');
			js_path = path.normalize(js_path);
			var minify_code = function(s){
				s = s.replace(/(\/?>)\s+|\s+(?=<)/g, '$1');
				// s = s.replace(/\\/g, "\\\\");
				s = s.replace(/\s*([\r\n]+)\s*/g, '$1');
				// s = s.replace(/([^\\])(')/g, "$1\\$2"); // '
				return s;
			};
			config.mkdirRecursive(path.dirname(js_path), 777, function(){
				var out_file = js_path + '.js';
				var data = {};
				var in_file;
				in_file = js_path.replace(/([\\\/])tpl([\\\/])/, "$1htpl$2") + '.tpl';
				var map = config.readJSONFile(path.dirname(in_file)+'/map.json');
				var stpl = map[req.path.split('.')[0].slice(1)];
				if(stpl){ // 有作映射读配置合并模板
					stpl = stpl.split(',');
					stpl.forEach(function(one, i){
						in_file = String(path.dirname(js_path) + '/').replace(/([\\\/])tpl([\\\/])/, "$1htpl$2") + one + '.tpl';
						var s = fs.readFileSync(in_file, {encoding:'utf8', flag: 'r'});
						s = minify_code(s);
						data[one] = s;
					});

					data = "define(" + JSON.stringify(data) + ");";
					fs.writeFile(out_file, data, {mode:'777'}, function(){
						return next();
					});
				}else{ // 找单个文件
					fs.exists(in_file, function(exists){
						if(exists){
							var s = fs.readFileSync(in_file, {encoding:'utf8', flag: 'r'});
							data[path.basename(in_file).split('.')[0]] = minify_code(s);
							data = "define(" + JSON.stringify(data) + ");";
							fs.writeFile(out_file, data, {mode:'777'}, function(){
								return next();
							});
						}else{ // 文件不存在
							return next();
						}
					});
				}
			});
		}else{
			return next();
		}
	}
};
module.exports = config;
