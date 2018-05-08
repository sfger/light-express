const path = require('path');
const glob = require('glob');
const root = path.resolve(__dirname);
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
// let WebpackMd5Hash = require('webpack-md5-hash');
let sassconfig = require('./sass.config.js');
let es3ifyPlugin = require('es3ify-webpack-plugin');
let entrysArray = glob.sync("**/*.@(entry).@(js?(x)|ts)", {
	cwd:'./src/',
	nobrace:true
});
// console.log(entrysArray);
// process.exit();
let entryMap = {};
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
let moduleResolver = ["module-resolver", {
	root: ['./'],
	alias: {
		"^@(.+)": "./components/\\1",
		"^~(.+)": "./src/\\1"
		// "@": root+"/components",
		// "~": root+"/src"
	},
	extensions:[".js", ".jsx", ".ts", ".tsx"]
}];
module.exports = {
	mode: 'development',
	context: path.normalize(root + '/src/'),
	devtool: false,
	entry: entryMap,
	output:{
		path: path.normalize(root + '/dist/'),
		// filename: "[name]_[chunkhash:8].js",
		filename: '[name].js',
		chunkFilename: '[name].js',
		libraryTarget: "umd"
		// library: 'test',
		// publicPath: '../dist/'
	},
	resolve:{
		modules: [
			path.join(root, "src"),
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
			},
			{
				test:/\.ts$/,
				exclude:/(node_modules)/,
				use:[
					{
						loader:'ts-loader',
						options:{
							configFile: 'tsconfig.json'
						}
					}
				]
			},
			{
				test:/\.jsx?$/,
				exclude:/(node_modules)/,
				type:"javascript/auto",
				use:[
					{
						loader:'babel-loader',
						options:{
							presets: [
								["es2015", {modules:false}],
								// ['es2015'],
								"stage-3",
								"react"
							],
							plugins: [
								["syntax-dynamic-import"],
								["transform-async-to-generator"],
								["transform-decorators-legacy"],
								["transform-class-properties"],
								["transform-runtime", {polyfill:false, regenerator:true}],
								// ["@babel/plugin-transform-flow-strip-types"],
								["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }],
								moduleResolver
							]
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [{
					loader: "vue-style-loader",
					options: {
						insertAt: "bottom"
					}
				}, {
					loader: "css-loader",
					options: {
						// modules: true,
						// localIdentName: '[local]_[hash:base64:8]'
					}
				}, {
					loader: "sass-loader",
					options: sassconfig
				}]
			},
			{
				test: /\.less$/,
				use: [{
					loader: "vue-style-loader",
					options: {
						insertAt: 'bottom'
					}
				}, {
					loader: "css-loader",
					options: {
						// modules: true,
						// localIdentName: '[local]_[hash:base64:8]'
					}
				}, {
					loader: 'less-loader',
					options: { javascriptEnabled: true }
				}]
			},
			{
				test:/\.css$/,
				// exclude:/(node_modules)/,
				use:[
					'vue-style-loader',
					{
						loader: "css-loader",
						options: {
							// modules: true,
							// localIdentName: '[local]_[hash:base64:8]'
						}
					}
				]
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
		new webpack.optimize.ModuleConcatenationPlugin(),
		new VueLoaderPlugin(),
		// new WebpackMd5Hash()
	],
	stats: {
		colors: true,
		chunks: false,
		modules: false,
		chunkModules: false,
		entrypoints: false
	},
	performance: false
	// performance: {
	// 	hints: "error"
	// }
};
