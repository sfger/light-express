var path = require('path');
var glob = require('glob');
var entrysArray = glob.sync("*/js/**/*.@(entry).@(js?(x)|ts)", {
	cwd:'./public/',
	nobrace:true
});
// console.log(entrysArray);
// process.exit();
var entryMap = {};
entrysArray.forEach((one) => {
	entryMap[one.replace(/\.entry\.(jsx?|ts)?$/, '')] = './' + one;
});
// console.log(entryMap);
// process.exit();
// entryMap.bundle = [
// 	'webpack/hot/dev-server',
// 	'webpack-dev-server/client?http://localhost',
// ];
// console.log(entryMap);

module.exports = {
	context: path.normalize(__dirname + '/public'),
	entry:entryMap,
	output:{
		path:__dirname+'/dist/',
		filename:'[name].js',
		chunkFilename:'[name].js',
		libraryTarget:"umd",
		// library:'test',
		// publicPath:'../dist/'
	},
	resolve:{
		// extensions:['', '.ts', '.js', '.jsx']
	},
	externals: {
		jquery: {
			amd: 'jquery',
			root: 'jQuery',
			commonjs: 'jquery',
			commonjs2: 'jquery'
		},
		react: {
			amd: 'react',
			root: 'React',
			commonjs: 'react',
			commonjs2: 'react'
		},
		'react-dom': {
			amd: 'react-dom',
			root: 'ReactDOM',
			commonjs: 'react-dom',
			commonjs2: 'react-dom'
		}
	},
	module:{
		rules:[
			{test:/\.ts$/, loader:'ts-loader'},
			{
				exclude:/(node_modules|bower_components)/,
				test:/\.jsx?$/,
				loader:'babel-loader',
				query:{
					presets:['es2015', 'react']
					// presets:['babili']
					// plugins: [
					// 	'transform-es2015-template-literals',
					// 	'transform-es2015-literals',
					// 	'transform-es2015-function-name',
					// 	'transform-es2015-arrow-functions',
					// 	'transform-es2015-block-scoped-functions',
					// 	'transform-es2015-classes',
					// 	'transform-es2015-object-super',
					// 	'transform-es2015-shorthand-properties',
					// 	'transform-es2015-computed-properties',
					// 	'transform-es2015-for-of',
					// 	'transform-es2015-sticky-regex',
					// 	'transform-es2015-unicode-regex',
					// 	'check-es2015-constants',
					// 	'transform-es2015-spread',
					// 	'transform-es2015-parameters',
					// 	'transform-es2015-destructuring',
					// 	'transform-es2015-block-scoping',
					// 	'transform-es2015-typeof-symbol',
					// 	['transform-regenerator', { async: false, asyncGenerators: false }],
					// 	"transform-es3-property-literals"
					// ],
				}
			},
			{test:/\.scss/, loader:'style-loader!css-loader!sass-loader'},
			{test:/\.css$/, loader:'style-loader!css-loader'},
			{test:/\.(png|jpg)$/, loader:'url-loader?limit=8192'}
		]
	},
	plugins:[]
};
