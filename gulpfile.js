var servers = {
	online:{
		host: '192.168.1.1',
		user: 'user',
		pass: 'pwd',
		remotePath: '/test/'
	},
	test:{
		host: '192.168.1.2',
		user: 'user',
		pass: 'pwd',
		remotePath: '/test/'
	}
}; 
var argsOptions = [{
	name      : 'dir', // 项目目录
	shortName : 'd',
	type      : '',
	help      : 'Project directory name'
},{
	name         : 'help', // 帮助信息
	shortName    : 'h',
	type         : 'bool',
	help         : 'Help info'
},{
	name         : 'server', // 目标服务器地址
	shortName    : 's',
	// defaultValue : 'online',
	type         : '',
	help         : 'Server info: ip user-name password remote-path'
}];

var args    = require('args');
var options = args.Options.parse(argsOptions);

var parsed_args;
try{
	parsed_args = args.parser(process.argv).parse(options);
}catch(e){
	console.log(options.getHelp());
	process.exit();
}

var project = parsed_args.dir;
if(!project){
	console.log('Please set a project to deploy!');
	process.exit();
}

if(parsed_args.help){
	console.log(options.getHelp());
	process.exit();
}

if(!servers[parsed_args.server]){
	console.log('server does not exist!');
	process.exit();
}
var pad = function(n, c){
	if((n = n + "").length < c){
		return new Array(++c - n.length).join("0") + n;
	}else{
		return n;
	}
};
var now = new Date();
var tArray = [
	now.getFullYear(),
	pad(now.getMonth()+1, 2),
	pad(now.getDate(), 2),
	pad(now.getHours(), 2),
	pad(now.getMinutes(), 2)
];
var timeString = tArray.join('');

var gulp         = require('gulp'),
	del          = require('del'),
	// sass         = require("gulp-sass"),
	// postcss      = require('gulp-postcss'),
	gutil        = require("gulp-util"),
	// autoprefixer = require('gulp-autoprefixer'),
	minifycss    = require('gulp-minify-css'),
	// jshint       = require('gulp-jshint'),
	uglify       = require('gulp-uglify'),
	// rename       = require('gulp-rename'),
	// concat       = require('gulp-concat'),
	replace      = require('gulp-replace'),
	// notify       = require('gulp-notify'),
	// imagemin     = require('gulp-imagemin'),
	// cache        = require('gulp-cache'),
	// livereload   = require('gulp-livereload'),
	sftp         = require('gulp-sftp');
gulp.task('del', function(cb){
	var dir = '*'===project ? '' : project;
	// console.log(dir);
	del(['dist/'+dir+'/**/*']).then(function(paths){
		console.log('Deleted files and folders:\n', paths.join('\n'));
		cb();
	});
});
gulp.task('css', ['del'], function(){
	var dir  = project + '/css';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*.css')
	.pipe(minifycss())
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('js', ['del'], function(){
	var dir  = project + '/js';
	var dist = '*'===project ? '' : dir;
	return gulp.src(['public/'+dir+'/**/*.js', '!./public/'+dir+'/**/*.@(entry).js', '!./public/**/parts/*.js'])
	.pipe(uglify())
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('tpl', ['del'], function(){
	var dir  = project + '/tpl';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('html', ['del'], function(){
	var dir  = project + '/html';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	.pipe(replace(/__version__/gi, timeString))
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('img', ['del'], function(){
	var dir  = project + '/img';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	// .pipe(cache(imagemin({optimizationLevel:3, progressive:true, interlaced:true})))
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('sprite', ['del'], function(){
	var dir  = project + '/sprite';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	.pipe(gulp.dest('dist/'+dist));
});

gulp.task('webpack', ['del'], function(cb){
	var webpack = require("webpack");
	var config = require('./webpack.config.js');
	config.plugins = [
		new webpack.optimize.UglifyJsPlugin({
			mangle:{
				except:['$super', '$', 'exports', 'require']
			}
		})
	];
	var compiler = webpack(config);
	compiler.run(function(err, stats){
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({}));
		cb();
	});
});
// gulp.task('dist', function(){
// 	return gulp.start('css', 'img', 'html', 'tpl', 'webpack', 'js');
// });
// gulp.task('public', function(){
// 	return gulp.src('dist/'+project+'/**/*')
// 	.pipe(gulp.dest('dist/list'));
// });
var task_list = ['css', 'img', 'tpl', 'webpack', 'js'];
if('test'===parsed_args.server) task_list.push('html');
gulp.task('default', task_list, function(){
	// return Promise.resolve();
	if('*'===project) project = '';
	var server = servers[parsed_args.server];
	server.remotePath += project;
	return gulp.src('dist/'+project+'/**/*')
	.pipe(sftp(server));
});
