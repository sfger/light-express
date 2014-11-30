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
		str = str.replace(/(\/?>)\s+|\s+(?=<)/g, '$1');
		return str;
	},
	writeStaticCache: function(url, ret){
		// console.log(url);
		if(url.length) url = url[0];
		var url_path = url.replace(/^\/|\/$/g, '');
		url_path = process.cwd() + '/' + config.staticDir + '/html/' + (url_path || 'index') + '.html';
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
	}
};
module.exports = config;
