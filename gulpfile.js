var args = require('args');
var options = args.Options.parse([{
	name      : 'dir', // 项目目录
	shortName : 'd',
	type      : '',
	help      : 'project dir name'
},{
	name         : 'help', // 帮助信息
	shortName    : 'h',
	type         : 'bool',
	help         : 'help'
},{
	name      : 'server', // 目标服务器地址
	shortName : 's',
	type      : '',
	help      : 'server info: ip user-name password remote-path'
}]);

var parsed_args;
try{
	parsed_args = args.parser(process.argv).parse(options);
}catch(e){
	console.log(options.getHelp());
	process.exit();
}
var project = parsed_args.dir
if(!project){
	console.log('Please set a project to deploy!');
	process.exit();
}
if(parsed_args.help){
	console.log(options.getHelp());
	process.exit();
}
var pad = function(n, c){
	if((n = n + "").length < c){
		c++;
		return new Array(c - n.length).join("0") + n;
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
	sass         = require("gulp-sass"),
	// postcss      = require('gulp-postcss'),
	gutil        = require("gulp-util"),
	// autoprefixer = require('gulp-autoprefixer'),
	minifycss    = require('gulp-minify-css'),
	jshint       = require('gulp-jshint'),
	uglify       = require('gulp-uglify'),
	rename       = require('gulp-rename'),
	concat       = require('gulp-concat'),
	replace      = require('gulp-replace'),
	notify       = require('gulp-notify'),
	sftp         = require('gulp-sftp'),
	// imagemin     = require('gulp-imagemin'),
	// cache        = require('gulp-cache'),
	livereload   = require('gulp-livereload');

gulp.task('del', function(cb){
	var dir = '*'===project ? '' : project;
	console.log(dir);
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
	return gulp.src(['public/'+dir+'/**/*.js', '!./public/'+dir+'/**/*.@(entry).js'])
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
gulp.task('default', ['css', 'img', 'html', 'tpl', 'webpack', 'js'], function(){
	return Promise.resolve();
	// return gulp.src('dist/'+project+'/**/*')
	// .pipe(gulp.dest('__remote'));

	// if('*'===project) project = '';
    // return gulp.src('dist/'+project+'/**/*')
    // .pipe(sftp({
        // host: '192.168.13.14',
        // user: 'test',
        // pass: 'test@test.com',
        // remotePath: '/path/to/dir/' + project
    // }));
});
