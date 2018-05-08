var argsOptions = require('./config/options');
var args    = require('args');
var options = args.options(argsOptions);
// var uglifyjs2_config = {
// 	ie8:true,
// 	compress: {screw_ie8:false, unsafe_comps:false, properties:false, comparisons:false},
// 	output  : {screw_ie8:false, quote_keys:true, ascii_only:true},
// 	// mangle  : false
// 	mangle: {
// 		screw_ie8:false,
// 		reserved:['$super']
// 	}
// };
var uglifyjs3_config = {
	ie8:true
};

var parsed_args;
try{
	parsed_args = args.parse(process.argv);
	if(parsed_args.help) throw new Error();
}catch(e){
	console.log(options.getHelp());
	process.exit();
}

var project = parsed_args.dir;
if(!project){
	console.log('Please set a project to deploy!');
	process.exit();
}

var server;
try{
	server = require('./config/'+parsed_args.server);
}catch(e){
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
	glob         = require('glob'),
	del          = require('del'),
	gutil        = require("gulp-util"),
	cleanCss     = require('gulp-clean-css'),
	// jshint       = require('gulp-jshint'),
	uglify       = require('gulp-uglify'),
	// rename       = require('gulp-rename'),
	// concat       = require('gulp-concat'),
	replace      = require('gulp-replace'),
	sftp         = require('gulp-sftp'),
	config = require('./webpack.config.js');
config.mode = "production";
gulp.task('del', function(cb){
	var dir = '*'===project ? '' : project;
	// console.log(dir);
	del(['dist/'+dir+'/**/*']).then(function(paths){
		console.log('Deleted files and folders:\n', paths.join('\n'));
		cb();
	});
});
gulp.task('css', function(){
	var dist = '*'===project ? '' : project;
	return gulp.src('src/'+project+'/**/*.css')
		.pipe(cleanCss({compatibility:"ie7"}))
		.pipe(gulp.dest('dist/'+dist));
});
gulp.task('js', function(){
	var dist = '*'===project ? '' : project;
	return gulp.src([
		'src/'+project+'/**/*.js',
		'!./src/'+project+'/**/*.@(entry).js',
		'!./src/**/parts/*.js'
	]).pipe(uglify(uglifyjs3_config)).pipe(gulp.dest('dist/'+dist));
});
gulp.task('html', function(){
	var dist = '*'===project ? '' : project;
	var src = ['src/'+project+'/**/*.html'];
	if('*'===project) src.push('src/*.html');
	return gulp.src(src)
		.pipe(replace(/__version__/gi, timeString))
		.pipe(gulp.dest('dist/'+dist));
});
gulp.task('img', function(){
	var dist = '*'===project ? '' : project;
	var list = [
		'src/'+project+'/**/*.jpg',
		'src/'+project+'/**/*.ico',
		'src/'+project+'/**/*.gif',
		'src/'+project+'/**/*.png',
	];
	if( !dist ) list.push( 'src/favicon.ico');
	return gulp.src(list).pipe(gulp.dest('dist/'+dist));
});
gulp.task('sprite', function(){
	var dist = '*'===project ? '' : project;
	return gulp.src('src/'+project+'/**/*')
		.pipe(gulp.dest('dist/'+dist));
});

gulp.task('webpack', function(cb){
	var dir = '*'===project ? '' : project;
	var webpack = require("webpack");
	// config.plugins = [
	// 	new webpack.optimize.UglifyJsPlugin(uglifyjs2_config)
	// ];
	var entrysArray = glob.sync("**/*.@(entry).@(js?(x)|ts?(x))", {
		cwd:'./src/'+dir+'/',
		nobrace:true
	});
	if(!entrysArray.length) return cb();
	// console.log(entrysArray);
	// process.exit();
	var entryMap = {};
	entrysArray.forEach((one) => {
		entryMap[dir+'/'+one.replace(/\.entry\.(jsx?|ts)?$/, '')] = './' + dir + '/' + one;
	});
	config.entry = entryMap;
	webpack(config).run(function(err, stats){
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({}));
		cb();
	});
});
// gulp.task('dist', function(){
// 	return gulp.start('css', 'img', 'html', 'tpl', 'webpack', 'js');
// });
// gulp.task('src', function(){
// 	return gulp.src('dist/'+project+'/**/*')
// 	.pipe(gulp.dest('dist/list'));
// });
gulp.task('deploy', function(){
	if('*'===project) project = '';
	server.remotePath += project;
	return gulp.src('dist/'+project+'/**/*')
		.pipe(sftp(server));
});
let tasks = ['del', 'css', 'img', 'webpack', 'js'];
if('test'===parsed_args.server) tasks.push('html');
tasks.push('deploy');
gulp.task('default', gulp.series.call(null, tasks));
