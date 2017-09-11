var fs         = require('fs');
var path       = require('path');
var root       = path.normalize(process.cwd());
var Readable   = require('stream').Readable;
var static_dir = path.normalize(root + '/public');
var view_dir   = static_dir;
var route_dir  = path.normalize(root + '/routes');

var webpackDev           = require("webpack-dev-middleware");
var webpack              = require("webpack");
var webpackConfig        = require('../webpack.config.js');
var compiler             = webpack(webpackConfig);
var webpackDevMiddleware = webpackDev(compiler, {stats:{colors:true}});
var memoryfs             = webpackDevMiddleware.fileSystem;

function read_json_file(p, cache=false){//{{{
	var path = require('path');
	var json = {};
	p = path.normalize(p);
	try{
		// var ret = fs.readFileSync(p, {encoding:'utf8', flag: 'r'});
		// json = JSON.parse(ret);
		if(!cache) delete require.cache[require.resolve(p)];
		json = require(p);
	}catch(e){
		console.log(e);
	}
	return json;
}//}}}
function minify_html(str){//{{{
	str = (str||'').replace(/(\/?>)\s+|\s+(?=<)/g, '$1');
	// str = str.replace(/\\/g, "\\\\");
	str = str.replace(/\s*([\r\n]+)\s*/g, '$1');
	// str = str.replace(/([^\\])(')/g, "$1\\$2"); // '
	return str;
}//}}}

var extension = {
	webpackDevMiddleware,
	static_dir,
	route_dir,
	view_dir,
	get_read_stream_iterator: function*(list, writer){
		let exist = true;
		let reg = new RegExp('^'+webpackConfig.context.replace(/[()^$*?+.-\\]/g, function(i){
			return '\\' + i;
		}));
		for(let item of list){
			if(!fs.existsSync(item)){
				// console.log(item);
				try{
					let stat = memoryfs.statSync(item.replace(reg, webpackConfig.output.path));
					if( !stat.isFile() ) throw new Error('no file');
				}catch(e){
					exist = false;
					console.log('File does not exist:', item);
					let err = new Error('Not Found');
					err.status = 404;
					yield err;
				}
			}
		}
		if( !(exist && list.length) ) return false;
		let types = {
			"js"  : "application/x-javascript",
			"css" : "text/css"
		};
		let type = list[0].split('.').pop();
		writer.writeHead(200, {"Content-Type":types[type]});
		for(let item of list){
			// console.log('fs:', item);
			let stream;
			if( !fs.existsSync(item) ){
				let source = item.replace(reg, webpackConfig.output.path);
				// console.log('mfs:', source);
				source = memoryfs.readFileSync(source);
				// console.log(source);
				stream = new Readable({autoClose:false});
				stream.push(source.toString()+"\n", 'utf8');
				stream.push(null);
			}else{
				stream = fs.createReadStream(item, {autoClose:false});
			}
			stream._destroy = function(){};
			yield stream;
		}
	},
	pipe_data: (iterator, writer, next) => {
		var item = iterator.next();
		if(item.done){
			writer.end('');
		}else{
			item = item.value;
			if(item instanceof Error){
				return writer.status(item.status).render(String(item.status), {
					message: item.message,
					error: {}
				});
			}
			item.pipe(writer, {end:false});
			item.on('end', ()=>{
				if(item.fd) fs.close(item.fd);
				item.destroy();
				extension.pipe_data(iterator, writer, next);
				// console.log('item', item);
			});
		}
	},
	pipe_stream_list_to_writer: (list, writer, next) => {
		let iterator = extension.get_read_stream_iterator(list, writer);
		extension.pipe_data(iterator, writer, next);
	},
	staticHttpCombo: (req, res, next) => {
		if(/\?\?/.test(req.originalUrl)){
			var file_list = req.originalUrl.slice(req.originalUrl.indexOf('??')+2).split('?')[0].split(',');
			var type      = file_list[file_list.length-1].split('.').reverse()[0];
			if(type==='js' || type==='css'){
				// 跳转，如：http://localhost/public/js??jquery.js,require.js?_a=1&v=20160101
				//        => http://localhost/public/js/??jquery.js,require.js?_a=1&v=20160101
				if(req.path[req.path.length-1]!=='/'){
					res.redirect(req.originalUrl.replace(/\?\?/, '/??'));
					// res.writeHead(302);
					return res.end('');
				}
			}else{ //暂时支持css和js，其它暂时没必要处理
				return next();
			}

			var list = [];
			file_list.forEach(one=>{
				var file = req.path + one;
				list.push(path.normalize(extension.static_dir + file));
			});
			if('js'===type){
				extension.pipe_stream_list_to_writer(list, res, next);
			}else{
				extension.compile_list_to_writer(list, res, next);
			}
		}else{
			next();
		}
		return true;
	},
	autoAddRoutes: (app, dirPath, routePath, defer) => {
		Promise.all(fs.readdirSync(dirPath).map(file=>{
			return new Promise((resolve, reject)=>{
				fs.stat(dirPath+'/'+file, (err, stats)=>{
					if( stats.isDirectory() ){
						extension.autoAddRoutes(app, dirPath+'/'+file, routePath+file+'/', {resolve, reject});
					}else if( stats.isFile() ){
						var list = file.split('.');
						if(list.length==2 && list[1]==='js'){
							var path   = routePath + list[0];
							var module = '/routes' + path;
							console.log("Auto add route!\n\tPath: ", path, '\n\tModule: ', module);
							app.use('/', require('..'+module));
						}
						resolve();
					}else{
						resolve();
					}
				});
			});
		})).then(()=>{
			defer.resolve();
		});
	},
	dist: function(err, ret){
		var req = this.req;
		if(err){
			console.log(err);
			return false;
		}
		// console.log(extension);
		if(req.query.minify!=='0') ret = minify_html(ret);
		if(req.query.dist!=='0'){
			extension.writeStaticCache(this.distPath || req.route.path, ret);
		}
		this.res.send(ret);
	},
	writeStaticCache: (url, ret) => {
		// console.log(url);
		if(typeof url == 'object' && url.length) url = url[0];
		var url_path = url.replace(/^\/|\/$/g, '');
		// url_path = extension.static_dir + '/../html/' + (url_path || 'index') + '.html';
		url_path = extension.static_dir + '/' + (url_path || 'index') + '.html';
		url_path = path.normalize(url_path);
		extension.mkdirRecursive(path.dirname(url_path), 777, ()=>{
			fs.writeFile(url_path, ret, (err)=>{
				if(err) throw err;
				console.log('Dist ' + url_path + ' succeed!');
			});
		});
	},
	mkdirRecursive: (dirpath, mode, callback)=>{
		fs.exists(dirpath, (exists)=>{
			if(exists){
				callback(dirpath);
			}else{
				extension.mkdirRecursive(path.dirname(dirpath), mode, ()=>{
					fs.mkdir(dirpath, mode, callback);
				});
			}
		});
	},
	nodeSass: (in_file, out_file, defer, next)=>{
		var sass    = require('node-sass');
		var postcss = require('postcss');
		sass.render({
			alias        : {
				'@' : '/components/scss/',
				'~' : '/node_modules/',
				'/' : '/public/'
			},
			file         : in_file,
			// includePaths : [path.normalize(static_dir+'/public/scss')],
			importer     : function(url, prev){
				let leading = url.charAt(0);
				let map     = this.options.alias;
				if(leading in map){
					url = path.normalize(root + map[leading] + url.slice(1));
					url = path.relative(path.dirname(prev), url);
				}
				return {file:url};
			},
			indentWidth  : 1,
			linefeed     : 'lf',
			indentType   : 'tab',
			outputStyle  : 'compact'
		}, (error, result)=>{
			if(error){
				console.log(error);
				console.log(error.status);
				console.log(error.column);
				console.log(error.message);
				console.log(error.line);
				return next&&next();
			}else{
				postcss([
					// require('postcss-sprites')({
					// 	stylesheetPath:path.dirname(out_file),
					// 	spritePath:out_file+'.sprite.png'
					// }),
					require('postcss-image-inliner')({
						assetPaths:[path.dirname(out_file)],
						maxFileSize:20480
					}),
					require('precss')({}),
					require('postcss-urlrev')({includeRemote:true})
				]).process(result.css, {
					from:in_file, to:out_file
				}).then(result=>{
					// console.log(result.css);
					fs.writeFile(out_file, result.css, {mode:'777'}, ()=>{
						console.log(`Compile ${out_file} success`);
						// return next();
					});
					defer.resolve(result.css);
				});
			}
		});
	},
	compile_list_to_writer: (list, res, next) => {
		Promise.all(list.map(css_path=>{
			return new Promise((resolve, reject)=>{
				var css_dir   = path.normalize(path.dirname(css_path) + '/');
				var scss_dir  = css_dir.replace(/([\\/])css([\\/])/, "$1scss$2");
				var scss_path = scss_dir + path.basename(css_path, '.css') + '.scss';
				extension.mkdirRecursive(css_dir, 777, ()=>{
					extension.nodeSass(scss_path, css_path, {resolve, reject}, next);
				});
			});
		})).then(css_ret => {
			res.writeHead(200, {"Content-Type":'text/css'});
			res.end(css_ret.join("\n"));
		}).catch(e=>{
			console.log(e);
		});
		return true;
	},
	CompileSCSS: (req, res, next) => {
		if(/.*\.css$/.test(req.path)){
			var css_path = path.normalize(extension.static_dir + req.path);
			extension.compile_list_to_writer([css_path], res, next);
		}else{
			next();
		}
		return true;
	},
	merge_tpl_list: (list, out_file, next) => {
		var data = {};
		try{
			list.forEach((one) => {
				var s = fs.readFileSync(one, {encoding:'utf8', flag:'r'});
				if(~['tpl', 'ejs', 'html', 'htm'].indexOf(path.extname(one).slice(1))){
					s = minify_html(s);
				}
				data[path.basename(one)] = s;
			});
			fs.writeFile(out_file, "define("+JSON.stringify(data)+");", {mode:'777'}, function(){
				return next&&next();
			});
		}catch(e){
			console.log(e);
			next&&next();
		}
		return true;
	},
	CompileDir2JS: (dir) => {
		return new Promise((resolve, reject) => {
			extension.dir_compile(dir, {resolve, reject});
		}).then((data) => {
			data = Array.prototype.concat.apply([], data).filter(i=>i);
			return Promise.resolve(data);
		});
	},
	dir_compile: (dir, defer) => {
		fs.readdir(extension.static_dir + dir, (err, files)=>{
			files.length && Promise.all(files.map((one)=>{
				return new Promise((resolve, reject)=>{
					var file_path = dir + one;
					fs.stat(extension.static_dir+file_path, (err, stats)=>{
						if(stats.isDirectory()){
							extension.dir_compile(file_path+'/', {resolve, reject});
						}else{
							if('.json'!==path.extname(file_path)){
								var req = {path:path.normalize(file_path.replace(/([\\/])htpl([\\/])/, "$1tpl$2")+'.js').replace(/\\/g, '/')};
								extension.Compile2JS(req, {});
								resolve(path.normalize(extension.static_dir + file_path));
							}else resolve(null);
						}
					});
				});
			})).then(defer.resolve);
		});
	},
	/*
	 * 每次请求模块文件时，动态编译相应的模块文件
	 * 具有合并多个模块文件为一个的功能
	 * */
	Compile2JS: (req, res, next) => {
		if(!/\/tpl\/.*\.js$/.test(req.path)) return next&&next();
		var out_file   = path.normalize(extension.static_dir + req.path);
		var out_path   = path.normalize(path.dirname(out_file) + '/');
		var in_path    = path.normalize(out_path.replace(/([\\/])tpl([\\/])/, "$1htpl$2"));
		var in_file    = in_path + path.basename(out_file, '.js');
		var path_patch = in_file.split(/([\\/])(htpl)([\\/])/).slice(0, 4);
		path_patch.push('map.json');
		extension.mkdirRecursive(out_path, 777, ()=>{
			var list = [];
			var map  = read_json_file(path_patch.join(''));
			var stpl = map[req.path.replace(/\.js$/,'').slice(1)];
			if( stpl ){ // 多模块合并
				stpl.split(',').forEach((one) => {
					list.push(out_path.replace(/([\\/])tpl([\\/])/, "$1htpl$2") + one + '.tpl');
				});
			}else{
				list.push(in_file);
			}
			extension.merge_tpl_list(list, out_file, next);
		});
		return true;
	}
};
module.exports = extension;
