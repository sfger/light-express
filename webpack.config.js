var path = require('path');
var glob = require('glob');
var entrysArray = glob.sync("js/**/*.@(entry).js", {
	cwd:'./public/',
	nobrace:true
});
// console.log(entrysArray);
var entryMap = {};
entrysArray.forEach((one, i)=>{
	entryMap[one.replace(/\.entry\.js$/, '')] = './' + one;
});
// console.log(entryMap);

module.exports = {
	context: path.normalize(__dirname + '/public'),
    entry:entryMap,
    output:{
        path:__dirname+'/../dist/',
        filename:'[name].js',
        chunkFilename:'[name].js',
        libraryTarget:"amd",
        // library:'test',
        publicPath:'../dist/'
    },
    resolve:{
    },
    module:{
        loaders:[
            {
                exclude:/(node_modules|bower_components)/,
                test:/\.js$/,
                loader:'babel-loader'
            },
            {test:/\.scss/, loader:'style-loader!css-loader!sass-loader'},
            {test:/\.css$/, loader:'style-loader!css-loader'},
            {test:/\.(png|jpg)$/, loader:'url-loader?limit=8192'}
        ]
    },
    plugins:[]
};
