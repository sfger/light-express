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
				options:{
					presets: [
						// ['es2015', {modules:false}],
						['es2015'],
						'react'
					]
				}
			},
			{test:/\.scss/, loader:'style-loader!css-loader!sass-loader'},
			{test:/\.css$/, loader:'style-loader!css-loader'},
			{test:/\.(png|jpg)$/, loader:'url-loader?limit=8192'}
		]
	},
	plugins:[]
};
