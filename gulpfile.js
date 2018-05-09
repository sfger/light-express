let argsOptions = require( './config/options' );
let args = require( 'args' );
let options = args.options( argsOptions );
let uglifyjs3_config = {
	ie8: true
};

let parsed_args;
try {
	parsed_args = args.parse( process.argv );
	if ( parsed_args.help ) throw new Error();
} catch ( e ) {
	console.log( options.getHelp() );
	process.exit();
}

let project = parsed_args.dir;
if ( !project ) {
	console.log( 'Please set a project to deploy!' );
	process.exit();
}

let server;
try {
	server = require( './config/' + parsed_args.server );
} catch ( e ) {
	console.log( 'server does not exist!' );
	process.exit();
}
let pad = function ( n, c ) {
	if ( ( n = n + "" ).length < c ) {
		return new Array( ++c - n.length ).join( "0" ) + n;
	} else {
		return n;
	}
};
let now = new Date();
let tArray = [
	now.getFullYear(),
	pad( now.getMonth() + 1, 2 ),
	pad( now.getDate(), 2 ),
	pad( now.getHours(), 2 ),
	pad( now.getMinutes(), 2 )
];
let timeString = tArray.join( '' );

let gulp = require( 'gulp' ),
	glob = require( 'glob' ),
	del = require( 'del' ),
	gutil = require( "gulp-util" ),
	cleanCss = require( 'gulp-clean-css' ),
	// jshint       = require('gulp-jshint'),
	uglify = require( 'gulp-uglify' ),
	// rename       = require('gulp-rename'),
	// concat       = require('gulp-concat'),
	replace = require( 'gulp-replace' ),
	sftp = require( 'gulp-sftp' ),
	config = require( './webpack.config.js' );
config.mode = "production";
gulp.task( 'del', function ( cb ) {
	let dir = '*' === project ? '' : project;
	// console.log(dir);
	del( [ 'dist/' + dir + '/**/*' ] ).then( function ( paths ) {
		console.log( 'Deleted files and folders:\n' + paths.join( '\n' ) );
		cb();
	} );
} );
gulp.task( 'css', function () {
	let dist = '*' === project ? '' : project;
	return gulp.src( 'src/' + project + '/**/*.css' )
		.pipe( cleanCss( { compatibility: "ie7" } ) )
		.pipe( gulp.dest( 'dist/' + dist ) );
} );
gulp.task( 'js', function () {
	let dist = '*' === project ? '' : project;
	return gulp.src( [
		'src/' + project + '/**/*.js',
		'!./src/' + project + '/**/*.@(entry).js',
		'!./src/**/parts/*.js'
	] ).pipe( uglify( uglifyjs3_config ) ).pipe( gulp.dest( 'dist/' + dist ) );
} );
gulp.task( 'html', function () {
	let dist = '*' === project ? '' : project;
	let src = [ 'src/' + project + '/**/*.html' ];
	if ( '*' === project ) src.push( 'src/*.html' );
	return gulp.src( src )
		.pipe( replace( /__version__/gi, timeString ) )
		.pipe( gulp.dest( 'dist/' + dist ) );
} );
gulp.task( 'img', function () {
	let dist = '*' === project ? '' : project;
	let list = [
		'src/' + project + '/**/*.jpg',
		'src/' + project + '/**/*.ico',
		'src/' + project + '/**/*.gif',
		'src/' + project + '/**/*.png',
	];
	if ( !dist ) list.push( 'src/favicon.ico' );
	return gulp.src( list ).pipe( gulp.dest( 'dist/' + dist ) );
} );
gulp.task( 'sprite', function () {
	let dist = '*' === project ? '' : project;
	return gulp.src( 'src/' + project + '/**/*' )
		.pipe( gulp.dest( 'dist/' + dist ) );
} );

gulp.task( 'webpack', function ( cb ) {
	let dir = '*' === project ? '' : project;
	let webpack = require( "webpack" );
	let entrysArray = glob.sync( "**/*.@(entry).@(js?(x)|ts?(x))", {
		cwd: './src/' + dir + '/',
		nobrace: true
	} );
	if ( !entrysArray.length ) return cb();
	// console.log(entrysArray);
	// process.exit();
	let entryMap = {};
	entrysArray.forEach( ( one ) => {
		entryMap[ dir + '/' + one.replace( /\.entry\.(jsx?|ts)?$/, '' ) ] = './' + dir + '/' + one;
	} );
	config.entry = entryMap;
	webpack( config ).run( function ( err, stats ) {
		if ( err ) throw new gutil.PluginError( "webpack", err );
		gutil.log( "[webpack]", stats.toString( {
			colors: true,
			modules: false,
			entrypoints: false
		} ) );
		cb();
	} );
} );
gulp.task( 'deploy', function () {
	if ( '*' === project ) project = '';
	server.remotePath += project;
	return gulp.src( 'dist/' + project + '/**/*' )
		.pipe( sftp( server ) );
} );
let tasks = [ 'del', 'css', 'img', 'webpack', 'js' ];
if ( 'test' === parsed_args.server ) tasks.push( 'html' );
tasks.push( 'deploy' );
gulp.task( 'default', gulp.series.call( null, tasks ) );
