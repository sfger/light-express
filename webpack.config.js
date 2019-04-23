const path = require( "path" );
const glob = require( "glob" );
const root = path.resolve( __dirname );
const webpack = require( "webpack" );
const { VueLoaderPlugin } = require( "vue-loader" );
let sassconfig = require( "./sass.config.js" );
let es3ifyPlugin = require( "es3ify-webpack-plugin" );
let entrysArray = glob.sync( "**/*.@(entry).@(js|ts)?(x)", {
  cwd: "./src/",
  nobrace: true
} );
// console.log( entrysArray );
// process.exit();
let entryMap = {};
entrysArray.forEach( one => {
  entryMap[ one.replace( /\.entry\.(js|ts)x?$/, "" ) ] = "./" + one;
} );
// console.log( entryMap );
// process.exit();
// entryMap.bundle = [
//   "webpack/hot/dev-server",
//   "webpack-dev-server/client?http://localhost"
// ];
// console.log( entryMap );
let babelConfig = require( "./babel.config.js" );
module.exports = {
  mode: "development",
  context: path.normalize( root + "/src/" ),
  devtool: false,
  entry: entryMap,
  output: {
    path: path.normalize( root + "/dist/" ),
    // filename: "[name]_[chunkhash:8].js",
    filename: "[name].js",
    chunkFilename: "[name].js",
    publicPath: "/"
    // libraryTarget: "umd"
    // library: 'test',
    // publicPath: '../dist/'
  },
  resolve: {
    modules: [
      path.join( root, "src" ),
      "node_modules"
    ],
    extensions: [
      ".ts",
      ".vue",
      ".css",
      ".less",
      ".scss",
      ".sass",
      ".js",
      ".jsx",
      "png",
      "jpg"
    ],
    alias: {
      // vue$: "vue/dist/vue.esm.js"
      // react: "react/index.js"
    }
  },
  externals: {
    // jquery: {
    //   amd: "jquery",
    //   root: "jQuery",
    //   commonjs: "jquery",
    //   commonjs2: "jquery"
    // },
    // react: {
    //   amd: "react",
    //   root: "React",
    //   commonjs: "react",
    //   commonjs2: "react"
    // },
    // "react-dom": {
    //   amd: "react-dom",
    //   root: "ReactDOM",
    //   commonjs: "react-dom",
    //   commonjs2: "react-dom"
    // }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json"
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        type: "javascript/auto",
        use: [
          {
            loader: "babel-loader",
            options: babelConfig
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "vue-style-loader",
            options: {
              insertAt: "bottom"
            }
          },
          {
            loader: "css-loader",
            options: {
              // modules: true,
              // localIdentName: '[local]_[hash:base64:8]'
            }
          },
          {
            loader: "sass-loader",
            options: sassconfig
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "vue-style-loader",
            options: {
              insertAt: "bottom"
            }
          },
          {
            loader: "css-loader",
            options: {
              // modules: true,
              // localIdentName: '[local]_[hash:base64:8]'
            }
          },
          {
            loader: "less-loader",
            options: { javascriptEnabled: true }
          }
        ]
      },
      {
        test: /\.css$/,
        // exclude:/(node_modules)/,
        use: [
          "vue-style-loader",
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
        test: /\.(png|jpg)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new es3ifyPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new VueLoaderPlugin()
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
