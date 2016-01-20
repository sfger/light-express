var op = process.argv[2];
var project = process.argv[3];
if(op!=='-d' || !project){
	console.log('Please set a project to deploy!');
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
	sass         = require("gulp-sass"),
	// postcss      = require('gulp-postcss'),
	gutil        = require("gulp-util"),
	autoprefixer = require('gulp-autoprefixer'),
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

gulp.task('css', function(){
	var dir  = project + '/css';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*.css')
	.pipe(minifycss())
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('js', function(){
	var dir  = project + '/js';
	var dist = '*'===project ? '' : dir;
	return gulp.src(['public/'+dir+'/**/*.js', '!./public/'+dir+'/**/*.@(entry).js'])
	.pipe(uglify())
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('tpl', function(){
	var dir  = project + '/tpl';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('html', function(){
	var dir  = project + '/html';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	.pipe(replace(/__version__/gi, timeString))
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('img', function(){
	var dir  = project + '/img';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	// .pipe(cache(imagemin({optimizationLevel:3, progressive:true, interlaced:true})))
	.pipe(gulp.dest('dist/'+dist));
});
gulp.task('sprite', function(){
	var dir  = project + '/sprite';
	var dist = '*'===project ? '' : dir;
	return gulp.src('public/'+dir+'/**/*')
	.pipe(gulp.dest('dist/'+dist));
});

gulp.task('webpack', function(callback){
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
		callback();
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
	// return Promise.resolve();
	// return gulp.src('dist/'+project+'/**/*')
	// .pipe(gulp.dest('__remote'));
	if('*'===project) project = '';
    return gulp.src('dist/'+project+'/**/*')
    .pipe(sftp({
        host: '139.196.195.196',
        user: 'lscm',
        pass: 'haitao@123.com',
        remotePath: '/opt/cdn-image/upload/static-web/' + project
    }));
});
