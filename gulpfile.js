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

var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	replace = require('gulp-replace'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	// spriter = require('gulp-css-spriter'),
	// amdOptimize = require('amd-optimize'),
	livereload = require('gulp-livereload');

gulp.task('css', function() {
	return gulp.src('public/css/**/*.css')
	// .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	// .pipe(gulp.dest('css2'))
	// .pipe(rename({suffix: '.min'}))
	.pipe(replace(/__version__/gi, timeString))
	// .pipe(spriter({
	// 	// 生成的spriter的位置
	// 	'spriteSheet': 'dist/img/sprite_aa.png',
	// 	// 生成样式文件图片引用地址的路径
	// 	// 如下将生产：backgound:url(../images/sprite20324232.png)
	// 	'pathToSpriteSheetFromCSS': '../img/sprite_aa.png'
	// }))
	.pipe(minifycss())
	.pipe(gulp.dest('../dist/css'))
	// .pipe(notify({ message: 'Styles task complete' }));
});
gulp.task('js', function(){
	return gulp.src('public/js/**/*.js')
	// .pipe(jshint())
	// .pipe(jshint.reporter('default'))
	// .pipe(concat('all.js'))
	// .pipe(rename({ suffix: '.min' }))
	.pipe(uglify())
	.pipe(gulp.dest('../dist/js'))
	// .pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('lib', function() {
	return gulp.src('public/lib/**/*')
	.pipe(gulp.dest('../dist/lib'));
});
gulp.task('tpl', function() {
	return gulp.src('public/tpl/**/*')
	.pipe(gulp.dest('../dist/tpl'));
});
gulp.task('html', function() {
	return gulp.src('public/html/**/*')
	.pipe(gulp.dest('../dist/html'));
});
gulp.task('img', function() {
	return gulp.src('public/img/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('../dist/img'))
});
gulp.task('md', function() {
	return gulp.src('public/md/**/*')
	.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
	.pipe(gulp.dest('../dist/md'))
});
gulp.task('default', function() {
	gulp.start('css', 'js', 'img', 'html', 'lib', 'tpl', 'md');
});
// gulp.task('watch', function() {
// 	gulp.watch('css/*.css', ['css']);
// 	gulp.watch('js/*.js', ['js']);
// 	gulp.watch('img/*', ['img']);
// 	livereload.listen();
// 	gulp.watch(['./*']).on('change', livereload.changed);
// });
