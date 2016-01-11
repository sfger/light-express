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
	postcss      = require('gulp-postcss'),
	gutil        = require("gulp-util"),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss    = require('gulp-minify-css'),
	jshint       = require('gulp-jshint'),
	uglify       = require('gulp-uglify'),
	imagemin     = require('gulp-imagemin'),
	rename       = require('gulp-rename'),
	concat       = require('gulp-concat'),
	replace      = require('gulp-replace'),
	notify       = require('gulp-notify'),
	cache        = require('gulp-cache'),
	livereload   = require('gulp-livereload');

gulp.task('css', function(){
	return gulp.src('public/'+project+'/css/**/*.css')
	.pipe(replace(/__version__/gi, timeString))
	.pipe(minifycss())
	.pipe(gulp.dest('../dist/'+project+'/css'));
});
gulp.task('js', function(){
	return gulp.src(['public/'+project+'/js/**/*.js', '!./public/js/**/*.@(entry).js'])
	.pipe(uglify())
	.pipe(gulp.dest('../dist/'+project+'/js'));
});
gulp.task('tpl', function(){
	return gulp.src('public/'+project+'/tpl/**/*')
	.pipe(gulp.dest('../dist/'+project+'/tpl'));
});
gulp.task('html', function(){
	return gulp.src('public/'+project+'/html/**/*')
	.pipe(gulp.dest('../dist/'+project+'/html'));
});
gulp.task('img', function(){
	return gulp.src('public/img/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('../dist/'+project+'/img'));
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
gulp.task('default', function(){
	gulp.start('css', 'img', 'html', 'tpl', 'webpack', 'js');
});
