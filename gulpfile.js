var argsOptions = require('./config/options');
var args    = require('args');
var options = args.options(argsOptions);

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
gulp.task('del', function(cb){
	var dir = '*'===project ? '' : project;
	// console.log(dir);
	del(['dist/'+dir+'/**/*']).then(function(paths){
		console.log('Deleted files and folders:\n', paths.join('\n'));
		cb();
	});
});
gulp.task('css', ['del'], function(){
	var dist = '*'===project ? '' : project;
	return gulp.src('public/'+project+'/**/*.css')
	.pipe(cleanCss(({compatibility:"ie7"})))
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('js', ['del'], function(){
	var dist = '*'===project ? '' : project;
	return gulp.src([
		'public/'+project+'/**/*.js',
		'!./public/'+project+'/**/*.@(entry).js',
		'!./public/**/parts/*.js'
	]).pipe(uglify({
		ie8:true,
		compress:{properties:false,comparisons:false},
		output:{quote_keys:true, ascii_only:true}
		// mangle:false
		// mangle:{
		// 	except:['$super', '$', 'exports', 'require']
		// }
	})).pipe(gulp.dest('dist/'+dist));
});
gulp.task('html', ['del'], function(){
	var dist = '*'===project ? '' : project;
	var src = ['public/'+project+'/**/*.html'];
	if('*'===project) src.push('public/*.html');
	return gulp.src(src)
	.pipe(replace(/__version__/gi, timeString))
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('img', ['del'], function(){
	var dist = '*'===project ? '' : project;
	return gulp.src([
		'public/'+project+'/**/*.jpg',
		'public/'+project+'/**/*.ico',
		'public/'+project+'/**/*.gif',
		'public/'+project+'/**/*.png',
		'public/favicon.ico'
	]).pipe(gulp.dest('dist/'+dist));
});
gulp.task('sprite', ['del'], function(){
	var dist = '*'===project ? '' : project;
	return gulp.src('public/'+project+'/**/*')
	.pipe(gulp.dest('dist/'+dist));
});

gulp.task('webpack', ['del'], function(cb){
	var dir = '*'===project ? '' : project;
	var webpack = require("webpack");
	config.plugins = [
		new webpack.optimize.UglifyJsPlugin({
			ie8: true,
			compress:{properties:false,comparisons:false},
			output:{quote_keys:true, ascii_only:true}
			// mangle:false
			// mangle:{
			// 	except:['$super', '$', 'exports', 'require']
			// }
		})
	];
	var entrysArray = glob.sync("**/*.@(entry).@(js?(x)|ts?(x))", {
		cwd:'./public/'+dir+'/',
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
// gulp.task('public', function(){
// 	return gulp.src('dist/'+project+'/**/*')
// 	.pipe(gulp.dest('dist/list'));
// });
var task_list = ['css', 'img', 'webpack', 'js'];
if('test'===parsed_args.server) task_list.push('html');
gulp.task('default', task_list, function(){
	// return Promise.resolve();
	if('*'===project) project = '';
	server.remotePath += project;
	return gulp.src('dist/'+project+'/**/*')
	.pipe(sftp(server));
});
