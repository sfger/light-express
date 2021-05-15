const fs = require( "fs" );
const path = require( "path" );
const root = path.normalize( process.cwd() );
const { Readable } = require( "stream" );
const staticRoot = path.normalize( `${ root }/src` );
const viewRoot = staticRoot;
const routeRoot = path.normalize( `${ root }/routes` );

function readJsonFile( p, cache = false ) {
  let json = {};
  p = path.normalize( p );
  if ( !cache ) delete require.cache[ require.resolve( p ) ];
  json = require( p );
  return json;
}

function minifyHtml( str ) {
  str = ( str || "" ).replace( /(\/?>)\s+|\s+(?=<)/g, "$1" );
  // str = str.replace(/\\/g, "\\\\");
  str = str.replace( /\s*([\r\n]+)\s*/g, "$1" );
  // str = str.replace(/([^\\])(')/g, "$1\\$2"); // '
  return str;
}

let buildRegExp = str => new RegExp( "^" + str.replace( /[()^$*?+.-\\]/g, c => `\\${ c }` ) );

let debug = require( "debug" );
let distDebug = debug( "Dist HTML:" );
distDebug.enabled = true;
let scssDebug = debug( "SCSS comple:" );
scssDebug.enabled = true;

let ext = {
  staticRoot,
  routeRoot,
  viewRoot,

  runWebpack: function() {
    const webpack = require( "webpack" );
    const WebpackDev = require( "webpack-dev-middleware" );
    let webpackConfig = this.webpackConfig = require( "../webpack.config.js" );
    let allEntry = this.allEntry = webpackConfig.entry;
    this.staticRootReg = buildRegExp( webpackConfig.context ),
    webpackConfig.entry = () => {
      let firstEntryKey = Object.keys( allEntry )[ 0 ];
      return { [ firstEntryKey ]: allEntry[ firstEntryKey ] };
    };
    this.webpackCompiler = webpack( webpackConfig );
    this.webpackDev = WebpackDev( this.webpackCompiler, {
      // root,
      // watchOptions: {
      //   ignored: /node_modules/,
      //   aggregateTimeout: 500,
      //   poll: false
      // },
      stats: {
        colors: true,
        modules: false,
        entrypoints: false
      }
    } );
  },

  escapeStaticRoot: function( item ) {
    let { staticRootReg, webpackConfig } = this;
    return item.replace( staticRootReg, webpackConfig.output.path );
  },

  pipe_stream_list_to_writer: async function( list, writer ) {
    // 先判断所有文件是否存在
    let exist = true;
    let memoryfs = this.webpackDev.context.outputFileSystem;
    for ( let item of list ) {
      if ( !fs.existsSync( item ) ) {
        try {
          let stat = memoryfs.statSync( this.escapeStaticRoot( item ) );
          if ( !stat.isFile() ) throw new Error( "no file" );
        } catch ( e ) {
          exist = false;
          console.log( "File does not exist:", item );
        }
      }
    }
    if ( !( exist && list.length ) ) {
      return writer.status( 404 ).render( "404", {
        message: "Not Found",
        error: {}
      } );
    }

    // 处理文件内容
    let mimes = {
      js: "application/x-javascript",
      css: "text/css"
    };
    let type = list[ 0 ].split( "." ).pop();
    writer.writeHead( 200, { "Content-Type": mimes[ type ] } );
    for ( let item of list ) {
      let stream;
      if ( fs.existsSync( item ) ) {
        // FS
        stream = fs.createReadStream( item, { autoClose: false } );
      } else {
        // MemoryFS
        let source = this.escapeStaticRoot( item );
        source = memoryfs.readFileSync( source );
        stream = new Readable();
        stream.push( source.toString() + "\n", "utf8" );
        stream.push( null );
      }
      stream._destroy = function() {};
      await new Promise( function( resolve ) {
        stream.pipe(
          writer,
          { end: false }
        );
        stream.on( "end", () => {
          // 文件流完成后再处理下一个文件，防止返回的顺序不对。
          // console.log(item, stream.fd);
          if ( stream.fd ) fs.close( stream.fd );
          stream.destroy();
          resolve();
          // console.log('stream', stream);
        } );
      } );
    }
    writer.end();
  },

  staticHttpCombo: ( req, res, next ) => {
    if ( !/\?\?/.test( req.originalUrl ) ) return next();
    let file_list = req.originalUrl
      .slice( req.originalUrl.indexOf( "??" ) + 2 )
      .split( "?" )[ 0 ]
      .split( "," );
    let type = file_list[ file_list.length - 1 ].split( "." ).reverse()[ 0 ];
    // eslint-disable-next-line array-element-newline, array-bracket-newline
    if ( !~[ "js", "css" ].indexOf( type ) ) return next();

    // 跳转，如：http://localhost/public/js??jquery.js,require.js?_a=1&v=20160101
    //        => http://localhost/public/js/??jquery.js,require.js?_a=1&v=20160101
    if ( req.path[ req.path.length - 1 ] !== "/" ) {
      res.redirect( req.originalUrl.replace( /\?\?/, "/??" ) );
      // res.writeHead(302);
      return res.end();
    }

    let list = file_list.map( one => {
      let file = req.path + one;
      return path.normalize( ext.staticRoot + file );
    } );
    if ( "js" === type ) ext.pipe_stream_list_to_writer( list, res, next );
    else ext.compile_list_to_writer( list, res, next );
  },

  autoAddRoutes: ( app, dirPath, routePath ) => {
    return Promise.all(
      fs.readdirSync( dirPath ).map( file => {
        return new Promise( resolve => {
          fs.stat( dirPath + "/" + file, ( err, stats ) => {
            if ( stats.isDirectory() ) {
              ext.autoAddRoutes( app, dirPath + "/" + file, routePath + file + "/" ).then( resolve );
            } else if ( stats.isFile() ) {
              let list = file.split( "." );
              if ( list.length == 2 && list[ 1 ] === "js" ) {
                let path = routePath + list[ 0 ];
                let module = "/routes" + path;
                console.log( "Auto add route!\n\tPath: ", path, "\n\tModule: ", module );
                app.use( "/", require( ".." + module ) );
              }
            }
            resolve();
          } );
        } );
      } )
    );
  },

  dist: function( err, ret ) {
    let { req } = this;
    if ( err ) return console.log( err );
    // console.log(ext);
    // if ( req.query.minify !== '0' ) ret = minifyHtml( ret );
    if ( req.query.dist !== "0" ) ext.writeStaticCache( this.distPath || req.route.path, ret );
    this.res.send( ret );
  },

  writeStaticCache: ( url, ret ) => {
    // console.log(url);
    if ( typeof url == "object" && url.length ) url = url[ 0 ];
    let url_path = url.replace( /^\/|\/$/g, "" );
    // url_path = ext.staticRoot + '/../html/' + (url_path || 'index') + '.html';
    url_path = ext.staticRoot + "/" + ( url_path || "index" ) + ".html";
    url_path = path.normalize( url_path );
    ext.mkdirRecursive( path.dirname( url_path ), 777, () => {
      fs.writeFile( url_path, ret, err => {
        if ( err ) throw err;
        distDebug( url_path );
      } );
    } );
  },

  mkdirRecursive: ( dirpath, mode, callback ) => {
    fs.exists( dirpath, exists => {
      if ( exists ) {
        callback( dirpath );
      } else {
        ext.mkdirRecursive( path.dirname( dirpath ), mode, () => {
          fs.mkdir( dirpath, mode, callback );
        } );
      }
    } );
  },

  nodeSass: ( in_file, out_file, defer, next ) => {
    let sass = require( "node-sass" );
    let postcss = require( "postcss" );
    let sassconfig = require( "../sassOptions.js" );
    sassconfig.file = in_file;
    sass.render( sassconfig, ( error, result ) => {
      if ( error ) {
        console.log( error );
        console.log( error.status );
        console.log( error.column );
        console.log( error.message );
        console.log( error.line );
        return next && next();
      }
      postcss( [
        require( "postcss-image-inliner" )( {
          assetPaths: [ path.dirname( out_file ) ],
          maxFileSize: 20480
        } ),
        require( "postcss-urlrev" )( { includeRemote: true } )
      ] )
        .process( result.css, {
          from: in_file,
          to: out_file
        } )
        .then( result => {
          // console.log( result.css );
          fs.writeFile( out_file, result.css, { mode: "777" }, () => {
            scssDebug( out_file );
            // return next && next();
          } );
          defer.resolve( result.css );
        } );
    } );
  },

  compile_list_to_writer: ( list, res, next ) => {
    Promise.all(
      list.map( css_path => {
        return new Promise( ( resolve, reject ) => {
          let css_dir = path.normalize( path.dirname( css_path ) + "/" );
          let scss_dir = css_dir.replace( /([\\/])css([\\/])/, "$1scss$2" );
          let scss_path = scss_dir + path.basename( css_path, ".css" ) + ".scss";
          ext.mkdirRecursive( css_dir, 777, () => {
            ext.nodeSass( scss_path, css_path, { resolve, reject }, next );
          } );
        } );
      } )
    )
      .then( css_ret => {
        res.writeHead( 200, { "Content-Type": "text/css" } );
        res.end( css_ret.join( "\n" ) );
      } )
      .catch( e => {
        console.log( e );
      } );
    return true;
  },

  CompileJS: ( req, res, next ) => {
    if ( !/.*\.js/.test( req.originalUrl ) ) return next();
    let jsList = [];
    if ( /\?\?/.test( req.originalUrl ) ) {
      jsList = req.originalUrl
        .slice( req.originalUrl.indexOf( "??" ) + 2 )
        .split( "?" )[ 0 ]
        .split( "," );
      for ( let item of jsList ) {
        if ( !/.*\.js/.test( item ) ) return next();
      }
      jsList = jsList.map( one => {
        return req.path + one;
      } );
    } else {
      jsList = [ req.path ];
    }

    const SingleEntryPlugin = require( "webpack/lib/SingleEntryPlugin" );
    let { allEntry, webpackCompiler, webpackDev } = ext;
    let ret = jsList.reduce( ( o, item ) => {
      let key = item.slice( 1, -3 );
      if ( key in allEntry ) {
        o[ key ] = allEntry[ key ];
        // webpackCompiler.apply( new SingleEntryPlugin( viewRoot, allEntry[ key ], key ) );
        new SingleEntryPlugin( viewRoot, allEntry[ key ], key ).apply( webpackCompiler );
        delete allEntry[ key ];
      }
      return o;
    }, {} );
    // console.log(ret);
    if ( !Object.keys( ret ).length ) return next();
    webpackDev.invalidate();
    webpackDev.waitUntilValid( () => {
      // return res.redirect( req.originalUrl );
      next();
    } );
  },

  CompileSCSS: ( req, res, next ) => {
    if ( !/.*\.css$/.test( req.path ) ) return next();
    let css_path = path.normalize( ext.staticRoot + req.path );
    ext.compile_list_to_writer( [ css_path ], res, next );
  },

  merge_tpl_list: ( list, out_file, next ) => {
    let data = {};
    try {
      list.forEach( one => {
        let s = fs.readFileSync( one, { encoding: "utf8", flag: "r" } );
        // eslint-disable-next-line array-element-newline, array-bracket-newline
        let list = [ "tpl", "ejs", "html", "htm" ];
        if ( ~list.indexOf( path.extname( one ).slice( 1 ) ) ) s = minifyHtml( s );
        data[ path.basename( one ) ] = s;
      } );
      fs.writeFile( out_file, "define(" + JSON.stringify( data ) + ");", { mode: "777" }, function() {
        return next && next();
      } );
    } catch ( e ) {
      console.log( e );
      next && next();
    }
    return true;
  },

  CompileDir2JS: dir => {
    return ext.dir_compile( dir ).then( data => {
      data = Array.prototype.concat.apply( [], data ).filter( i => i );
      return Promise.resolve( data );
    } );
  },

  dir_compile: dir => {
    return new Promise( resolve => {
      fs.readdir( ext.staticRoot + dir, ( err, files ) => {
        if ( !files.length ) return;
        Promise.all(
          files.map(
            one =>
              new Promise( resolve => {
                let file_path = dir + one;
                fs.stat( ext.staticRoot + file_path, ( err, stats ) => {
                  if ( stats.isDirectory() ) return ext.dir_compile( file_path + "/" ).then( resolve );
                  if ( ".json" !== path.extname( file_path ) ) {
                    let req = { path: path.normalize( file_path.replace( /([\\/])htpl([\\/])/, "$1tpl$2" ) + ".js" ).replace( /\\/g, "/" ) };
                    ext.Compile2JS( req, {} );
                    resolve( path.normalize( ext.staticRoot + file_path ) );
                  } else resolve( null );
                } );
              } )
          )
        ).then( resolve );
      } );
    } );
  },

  /**
   * 每次请求模块文件时，动态编译相应的模块文件
   * 具有合并多个模块文件为一个的功能
   */
  Compile2JS: ( req, res, next ) => {
    if ( !/\/tpl\/.*\.js$/.test( req.path ) ) return next && next();
    let out_file = path.normalize( ext.staticRoot + req.path );
    let out_path = path.normalize( path.dirname( out_file ) + "/" );
    let in_path = path.normalize( out_path.replace( /([\\/])tpl([\\/])/, "$1htpl$2" ) );
    let in_file = in_path + path.basename( out_file, ".js" );
    let path_patch = in_file.split( /([\\/])(htpl)([\\/])/ ).slice( 0, 4 );
    path_patch.push( "map.json" );
    ext.mkdirRecursive( out_path, 777, () => {
      let list = [];
      let map = readJsonFile( path_patch.join( "" ) );
      let stpl = map[ req.path.replace( /\.js$/, "" ).slice( 1 ) ];
      if ( stpl ) {
        // 多模块合并
        stpl.split( "," ).forEach( one => {
          list.push( out_path.replace( /([\\/])tpl([\\/])/, "$1htpl$2" ) + one + ".tpl" );
        } );
      } else {
        list.push( in_file );
      }
      ext.merge_tpl_list( list, out_file, next );
    } );
    return true;
  }
};
module.exports = ext;
