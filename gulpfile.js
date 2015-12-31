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

// gulp.task('scss', function(event){
// 	gulp.src('public/scss/**/*.scss')
// 	.pipe(sass({
// 		linefeed:'lf',
// 		outputStyle:'compressed'
// 	}))
// 	.pipe(postcss([
// 		require('autoprefixer'),
// 		require('postcss-easysprites')({
// 			padding        : 1,
// 			imagePath      : './public/img',
// 			stylesheetPath : '../dist/css',
// 			spritePath     : '../dist/sprite'
// 		}),
// 		// require('postcss-sprites')({
// 		// 	stylesheetPath:'../dist/css/',
// 		// 	spritePath:'../dist/css/sprite.png'
// 		// }),
// 		// require('postcss-image-inliner')({
// 		// 	assetPaths:['../dist/css/'],
// 		// 	maxFileSize:20480
// 		// }),
// 		require('precss')({}),
// 		require('postcss-urlrev')({})
// 	]))
// 	// .pipe(replace(/__version__/gi, timeString))
// 	.pipe(gulp.dest('../dist/css'));
// });
gulp.task('css', function(){
	return gulp.src('public/css/**/*.css')
	// .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	// .pipe(gulp.dest('css2'))
	// .pipe(rename({suffix: '.min'}))
	.pipe(replace(/__version__/gi, timeString))
	.pipe(minifycss())
	.pipe(gulp.dest('../dist/css'));
	// .pipe(notify({ message: 'Styles task complete' }));
});
gulp.task('js', function(){
	return gulp.src(['public/js/**/*.js', '!./public/js/**/*.@(entry).js'])
	// .pipe(jshint())
	// .pipe(jshint.reporter('default'))
	// .pipe(concat('all.js'))
	.pipe(uglify())
	.pipe(gulp.dest('../dist/js'));
});
gulp.task('lib', function(){
	return gulp.src('public/lib/**/*')
	.pipe(gulp.dest('../dist/lib'));
});
gulp.task('tpl', function(){
	return gulp.src('public/tpl/**/*')
	.pipe(gulp.dest('../dist/tpl'));
});
gulp.task('html', function(){
	return gulp.src('public/html/**/*')
	.pipe(gulp.dest('../dist/html'));
});
gulp.task('img', function(){
	return gulp.src('public/img/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('../dist/img'));
});
gulp.task('md', function(){
	return gulp.src('public/md/**/*')
	.pipe(gulp.dest('../dist/md'));
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
	gulp.start('css', 'img', 'html', 'lib', 'tpl', 'md', 'webpack', 'js');
});
// gulp.task('watch', function() {
// 	gulp.watch('css/*.css', ['css']);
// 	gulp.watch('js/*.js', ['js']);
// 	gulp.watch('img/*', ['img']);
// 	livereload.listen();
// 	gulp.watch(['./*']).on('change', livereload.changed);
// });
