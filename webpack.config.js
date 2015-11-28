module.exports = {
    entry: {
        'js/case/seaShell/main':'./public/js/case/seaShell/main.js',
    },
    output: {
        path: __dirname+'/public/',
        filename: '[name].js',
        chunkFilename: '[name].js',
        libraryTarget: "amd"
        // library:'test',
        // publicPath: './dist/',
    },
    resolve: {
    },
    module: {
        loaders: [
            {
                exclude: /(node_modules|bower_components)/,
                test:/\.js$/,
                loader:'babel-loader'
            },
            {test:/\.scss/, loader:'style-loader!css-loader!sass-loader'},
            {test:/\.css$/, loader:'style-loader!css-loader'},
            {test:/\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    plugins: []
};
