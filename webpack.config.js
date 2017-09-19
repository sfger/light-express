var path = require('path');
var glob = require('glob');
var root = path.resolve(__dirname);
var webpack = require('webpack');
var sassconfig = require('./sass.config.js');
var es3ifyPlugin = require('es3ify-webpack-plugin');
var entrysArray = glob.sync("**/*.@(entry).@(js?(x)|ts)", {
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
var moduleResolver = ["module-resolver", {
	root: [root],
	alias: {
		"@": "/components",
		"~": "/public"
	},
	extensions:[".js", ".jsx", ".ts", ".tsx"]
}];
module.exports = {
	context: path.normalize(__dirname + '/public/'),
	entry: entryMap,
	output:{
		path: path.normalize(__dirname+'/dist/'),
		filename: '[name].js',
		chunkFilename: '[name].js',
		libraryTarget: "umd"
		// library: 'test',
		// publicPath: '../dist/'
	},
	resolve:{
		modules: [
			path.join(__dirname, "public"),
			"node_modules"
		],
		extensions:['.ts', '.vue', '.css', '.less', '.scss', '.sass', '.js', '.jsx', 'png', 'jpg'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
		}
	},
	externals: {
		// jquery: {
		// 	amd: 'jquery',
		// 	root: 'jQuery',
		// 	commonjs: 'jquery',
		// 	commonjs2: 'jquery'
		// },
		// react: {
		// 	amd: 'react',
		// 	root: 'React',
		// 	commonjs: 'react',
		// 	commonjs2: 'react'
		// },
		// 'react-dom': {
		// 	amd: 'react-dom',
		// 	root: 'ReactDOM',
		// 	commonjs: 'react-dom',
		// 	commonjs2: 'react-dom'
		// }
	},
	module:{
		rules:[
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						'scss': 'vue-style-loader!css-loader!sass-loader',
						'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
					}
				}
			},
			{
				test:/\.ts$/,
				// loader:'ts-loader'
				exclude:/(node_modules)/,
				use:[
					{
						loader:'ts-loader',
						options:{
							// plugins: [
							// 	moduleResolver
							// ]
						}
					}
				]
			},
			{
				test:/\.jsx?$/,
				exclude:/(node_modules)/,
				use:[
					{
						loader:'babel-loader',
						options:{
							presets: [
								// ['es2015', {modules:false}],
								['es2015'],
								'stage-3',
								'react',
							],
							plugins: [
								['syntax-dynamic-import'],
								['transform-async-to-generator'],
								['transform-class-properties'],
								['transform-decorators-legacy'],
								// ['transform-regenerator'],
								// ['transform-runtime'],
								['transform-runtime', {polyfill:false, regenerator:true}],
								['import', {libraryName:"antd", style:'css'}],
								moduleResolver
							]
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "style-loader",
					options: {
						insertAt: 'bottom'
					}
				}, {
					loader: "css-loader"
				}, {
					loader: "sass-loader",
					options: sassconfig
				}]
			},
			{
				test:/\.less$/,
				// exclude:/(node_modules)/,
				use:[ 'style-loader', 'css-loader', 'less-loader' ]
			},
			{
				test:/\.css$/,
				// exclude:/(node_modules)/,
				use:[ 'style-loader', 'css-loader' ]
			},
			{
				test:/\.(png|jpg)$/,
				exclude:/(node_modules)/,
				use:[
					{
						loader:'url-loader',
						options:{ limit:8192 }
					}
				]
			}
		]
	},
	plugins:[
		new es3ifyPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin()
	]
};
