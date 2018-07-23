/* eslint comma-dangle:1 */
/* eslint-disable */
/* eslint-enable */
/* eslint-disable comma-dangle */
/* eslint-enable comma-dangle */
/* global window,document */

let express = require( 'express' );
let app = express();
let morgan = require( 'morgan' );
let cookie = require( 'cookie-parser' );
let session = require( 'cookie-session' );
let bodyParser = require( 'body-parser' );
let compression = require( 'compression' );
let ext = require( './ext' );
app.ext = ext;
app.use( ext.webpackDev );
app.use( ext.CompileJS );
app.use( compression() );

app.set( 'views', './' );
app.engine( 'jsx', require( 'express-react-views' ).createEngine( {
  beautify: true,
  babel: {
    presets: [
      "stage-0",
      "react",
      [ 'env', { targets: { node: 'current' } } ]
    ],
    plugins: [
      [ "transform-async-to-generator" ],
      [ "transform-decorators-legacy" ],
      [ "transform-class-properties" ],
      [ "transform-runtime", { polyfill: false, regenerator: true } ],
      [ "module-resolver", {
        root: [ './' ],
        alias: {
          "^@(.+)": "./components/\\1",
          "^~(.+)": "./src/\\1"
        },
        extensions: [ ".js", ".jsx", ".ts", ".tsx" ]
      } ]
    ]
  }
} ) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) );
app.use( cookie() );
// app.locals.__version__ = '__version__';
app.use( session( {
  name: '_SSID_',
  keys: [ 'skey1', 'skey2' ]
} ) );
app.use( morgan( 'dev' ) );

app.use( ext.CompileSCSS );
app.use( ext.Compile2JS );
app.use( ext.staticHttpCombo );
ext.autoAddRoutes( app, ext.route_dir, '/' ).then( () => {
  app.use( express.static( ext.static_dir, {
    index: 'index.html'
  } ) );
  app.use( ( req, res, next ) => {
    let err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
  } );
  app.use( ( err, req, res, next ) => {
    console.log( 'ERROR:', err );
    let status = String( err.status || 500 );
    next && res.status( status ).render( status, {
      message: err.message,
      error: err
    } );
  } );
} ).catch( function ( err ) {
  console.log( 'Global Error', err );
} );
module.exports = app;
