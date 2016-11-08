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
		libraryTarget:"amd",
		// library:'test',
		publicPath:'../dist/'
	},
	resolve:{
		 // extensions:['', '.ts', '.js', '.jsx']
	},
	// externals: {
	// 	'react':'React',
	// 	'react-dom':'ReactDOM'
	// },
	module:{
		loaders:[
			{test:/\.ts$/, loader:'ts-loader'},
			{
				exclude:/(node_modules|bower_components)/,
				test:/\.jsx?$/,
				loader:'babel',
				query:{
					presets:['es2015', 'react']
				}
			},
			{test:/\.scss/, loader:'style-loader!css-loader!sass-loader'},
			{test:/\.css$/, loader:'style-loader!css-loader'},
			{test:/\.(png|jpg)$/, loader:'url-loader?limit=8192'}
		]
	},
	plugins:[]
};
