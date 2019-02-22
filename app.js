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
app.use( ext.CompileJS );
app.use( ext.webpackDev );
app.use( compression() );

app.set( 'views', ext.static_dir );
app.engine( 'jsx', require( 'express-react-views' ).createEngine( {
  beautify: true,
  babel: {
    plugins: [
      [ "@babel/plugin-proposal-decorators", { loose: true, legacy: true } ],
      [ "@babel/plugin-proposal-class-properties", { loose: true } ],
      [ "@babel/plugin-transform-flow-strip-types", { loose: true } ],
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

let debug = require( 'debug' )( 'test' );
let fs = require( 'fs' );

let port = Number( process.env.PORT ) || 80;
let https_port = Number( process.env.HTTPS_PORT ) || ( 443 + port - 80 );

require( 'https' ).createServer( {
  key: fs.readFileSync( './cert/key.pem' ),
  cert: fs.readFileSync( './cert/cert.pem' )
}, app ).listen( https_port );

app.set( 'port', port );
let server = app.listen( app.get( 'port' ), function () {
  debug( 'Express server listening on port ' + server.address().port );
} );
