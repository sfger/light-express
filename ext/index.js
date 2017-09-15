var fs            = require('fs');
var path          = require('path');
var root          = path.normalize(process.cwd());
var Readable      = require('stream').Readable;
var static_dir    = path.normalize(root + '/public');
var view_dir      = static_dir;
var route_dir     = path.normalize(root + '/routes');
var webpack       = require("webpack");
var webpackConfig = require('../webpack.config.js');
var sassconfig    = require('../sass.config.js');
var WebpackDev    = require("webpack-dev-middleware");
var compiler      = webpack(webpackConfig);
var webpackDev    = WebpackDev(compiler, {stats:{colors:true}});
var memoryfs      = webpackDev.fileSystem;
var mimes = {
	"js"  : "application/x-javascript",
	"css" : "text/css"
};
var reg = {
	static_dir: new RegExp('^'+webpackConfig.context.replace(/[()^$*?+.-\\]/g, function(i){
		return '\\' + i;
	}))
};
function read_json_file(p, cache=false){//{{{
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
var ext = {
	webpackDev,
	static_dir,
	route_dir,
	view_dir,
	pipe_stream_list_to_writer: async function(list, writer){
		// 先判断所有文件是否存在
		let exist = true;
		for(let item of list){
			if( !fs.existsSync(item) ){
				try{
					let stat = memoryfs.statSync(item.replace(reg.static_dir, webpackConfig.output.path));
					if( !stat.isFile() ) throw new Error('no file');
				}catch(e){
					exist = false;
					console.log('File does not exist:', item);
				}
			}
		}
		if( !(exist && list.length) ){
			return writer.status(404).render('404', {
				message: 'Not Found',
				error: {}
			});
		}

		// 处理文件内容
		let type = list[0].split('.').pop();
		writer.writeHead(200, {"Content-Type":mimes[type]});
		for(let item of list){
			let stream;
			if( fs.existsSync(item) ){ // FS
				stream = fs.createReadStream(item, {autoClose:false});
			}else{ // MemoryFS
				let source = item.replace(reg.static_dir, webpackConfig.output.path);
				source = memoryfs.readFileSync(source);
				stream = new Readable();
				stream.push(source.toString()+"\n", 'utf8');
				stream.push(null);
			}
			stream._destroy = function(){};
			await new Promise(function(resolve){
				stream.pipe(writer, {end:false});
				stream.on('end', ()=>{ // 文件流完成后再处理下一个文件，防止返回的顺序不对。
					// console.log(item, stream.fd);
					if(stream.fd) fs.close(stream.fd);
					stream.destroy();
					resolve();
					// console.log('stream', stream);
				});
			});
		}
		writer.end();
	},
	staticHttpCombo: (req, res, next) => {
		if( !/\?\?/.test(req.originalUrl) ) return next();
		var file_list = req.originalUrl.slice(req.originalUrl.indexOf('??')+2).split('?')[0].split(',');
		var type      = file_list[file_list.length-1].split('.').reverse()[0];
		if(!~['js','css'].indexOf(type)) return next();

		// 跳转，如：http://localhost/public/js??jquery.js,require.js?_a=1&v=20160101
		//        => http://localhost/public/js/??jquery.js,require.js?_a=1&v=20160101
		if(req.path[req.path.length-1]!=='/'){
			res.redirect(req.originalUrl.replace(/\?\?/, '/??'));
			// res.writeHead(302);
			return res.end();
		}

		var list = file_list.map(one=>{
			var file = req.path + one;
			return path.normalize(ext.static_dir + file);
		});
		if('js'===type) ext.pipe_stream_list_to_writer(list, res, next);
		else ext.compile_list_to_writer(list, res, next);
	},
	autoAddRoutes: (app, dirPath, routePath) => {
		return Promise.all(fs.readdirSync(dirPath).map(file=>{
			return new Promise((resolve)=>{
				fs.stat(dirPath+'/'+file, (err, stats)=>{
					if( stats.isDirectory() ){
						ext.autoAddRoutes(app, dirPath+'/'+file, routePath+file+'/').then(resolve);
					}else if( stats.isFile() ){
						var list = file.split('.');
						if(list.length==2 && list[1]==='js'){
							var path   = routePath + list[0];
							var module = '/routes' + path;
							console.log("Auto add route!\n\tPath: ", path, '\n\tModule: ', module);
							app.use('/', require('..'+module));
						}
					}
					resolve();
				});
			});
		}));
	},
	dist: function(err, ret){
		var req = this.req;
		if(err) return console.log(err);
		// console.log(ext);
		if(req.query.minify!=='0') ret = minify_html(ret);
		if(req.query.dist!=='0') ext.writeStaticCache(this.distPath || req.route.path, ret);
		this.res.send(ret);
	},
	writeStaticCache: (url, ret) => {
		// console.log(url);
		if(typeof url == 'object' && url.length) url = url[0];
		var url_path = url.replace(/^\/|\/$/g, '');
		// url_path = ext.static_dir + '/../html/' + (url_path || 'index') + '.html';
		url_path = ext.static_dir + '/' + (url_path || 'index') + '.html';
		url_path = path.normalize(url_path);
		ext.mkdirRecursive(path.dirname(url_path), 777, ()=>{
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
				ext.mkdirRecursive(path.dirname(dirpath), mode, ()=>{
					fs.mkdir(dirpath, mode, callback);
				});
			}
		});
	},
	nodeSass: (in_file, out_file, defer, next)=>{
		var sass    = require('node-sass');
		var postcss = require('postcss');
		sassconfig.file = in_file;
		sass.render(sassconfig, (error, result)=>{
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
				ext.mkdirRecursive(css_dir, 777, ()=>{
					ext.nodeSass(scss_path, css_path, {resolve, reject}, next);
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
		if( !/.*\.css$/.test(req.path) ) return next();
		var css_path = path.normalize(ext.static_dir + req.path);
		ext.compile_list_to_writer([css_path], res, next);
	},
	merge_tpl_list: (list, out_file, next) => {
		var data = {};
		try{
			list.forEach((one) => {
				var s = fs.readFileSync(one, {encoding:'utf8', flag:'r'});
				if( ~['tpl', 'ejs', 'html', 'htm'].indexOf(path.extname(one).slice(1)) ) s = minify_html(s);
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
			ext.dir_compile(dir, {resolve, reject});
		}).then((data) => {
			data = Array.prototype.concat.apply([], data).filter(i=>i);
			return Promise.resolve(data);
		});
	},
	dir_compile: (dir, defer) => {
		fs.readdir(ext.static_dir + dir, (err, files)=>{
			files.length && Promise.all(files.map((one)=>{
				return new Promise((resolve, reject)=>{
					var file_path = dir + one;
					fs.stat(ext.static_dir+file_path, (err, stats)=>{
						if(stats.isDirectory()){
							ext.dir_compile(file_path+'/', {resolve, reject});
						}else{
							if('.json'!==path.extname(file_path)){
								var req = {path:path.normalize(file_path.replace(/([\\/])htpl([\\/])/, "$1tpl$2")+'.js').replace(/\\/g, '/')};
								ext.Compile2JS(req, {});
								resolve(path.normalize(ext.static_dir + file_path));
							}else resolve(null);
						}
					});
				});
			})).then(defer.resolve);
		});
	},
	/* *
	 * 每次请求模块文件时，动态编译相应的模块文件
	 * 具有合并多个模块文件为一个的功能
	 * */
	Compile2JS: (req, res, next) => {
		if(!/\/tpl\/.*\.js$/.test(req.path)) return next&&next();
		var out_file   = path.normalize(ext.static_dir + req.path);
		var out_path   = path.normalize(path.dirname(out_file) + '/');
		var in_path    = path.normalize(out_path.replace(/([\\/])tpl([\\/])/, "$1htpl$2"));
		var in_file    = in_path + path.basename(out_file, '.js');
		var path_patch = in_file.split(/([\\/])(htpl)([\\/])/).slice(0, 4);
		path_patch.push('map.json');
		ext.mkdirRecursive(out_path, 777, ()=>{
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
			ext.merge_tpl_list(list, out_file, next);
		});
		return true;
	}
};
module.exports = ext;
