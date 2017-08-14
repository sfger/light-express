var path = require('path');
var glob = require('glob');
// var webpack = require('webpack');
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

module.exports = {
	context: path.normalize(__dirname + '/public'),
	entry:entryMap,
	output:{
		path:__dirname+'/dist/',
		filename:'[name].js',
		chunkFilename:'[name].js',
		libraryTarget:"umd"
		// library:'test',
		// publicPath:'../dist/'
	},
	resolve:{
		modules: [
			path.join(__dirname, "public"),
			"node_modules"
		],
		extensions:['.ts', '.vue', '.css', '.less', '.scss', '.sass', '.js', '.jsx', 'png', 'jpg'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			root: path.resolve(__dirname, 'public/'),
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
						// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
						// the "scss" and "sass" values for the lang attribute to the right configs here.
						// other preprocessors should work out of the box, no loader config like this necessary.
						'scss': 'vue-style-loader!css-loader!sass-loader',
						'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
					}
					// other vue-loader options go here
				}
			},
			{test:/\.ts$/, loader:'ts-loader'},
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
								['import', {libraryName:"antd", style:'css'}]
							]
						}
					}
				]
			},
			{
				test:/\.scss/,
				exclude:/(node_modules)/,
				use:[ 'style-loader', 'css-loader', 'sass-loader' ]
			},
			{
				test:/\.less/,
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
		// new webpack.optimize.ModuleConcatenationPlugin()
	]
};
