var fs = require( 'fs' );
var path = require( 'path' );
var express = require( 'express' );
var router = express.Router();

router.get( [ '/*.ejs', '/*.jsx', '/*.tpl', '/*.md', '/*.markdown', '/*.txt' ], function ( req, res, next ) {
  var err = new Error( 'Not Found' );
  err.status = 404;
  return next( err );
} );
router.get( [ '/', '/*.html' ], function ( req, res, next ) {
  var app = req.app;
  var url_path = req.path.slice( 1, -5 );
  if ( !url_path ) url_path = 'index';
  var view = url_path.replace( /\/html\//, '/views/' );
  var file = path.join( app.get( 'views' ), view ) + '.ejs';
  console.log(file);

  file = path.normalize( file );
  var exists = fs.existsSync( file );
  if ( exists ) {
    app.set( 'view engine', 'ejs' );
  } else {
    file = path.join( app.get( 'views' ), view ) + '.jsx';
    console.log(file);
    exists = fs.existsSync( file );
    if ( exists ) {
      app.set( 'view engine', 'jsx' );
    } else {
      return next();
    }
  }
  console.log(file);
  delete require.cache[ file ];
  console.log('..............', view);
  res.render( view, {
    ___: '',
    __version__: '__version__',
    // settings: {
    //   env: 'development'
    // },
    node: {
      placeholder: {
        white: "/common/img/placeholder.png"
      },
      get_img: function ( width, height, bg, color, text ) {
        var colorTrans = function ( c ) {
          return c.replace( /./g, function ( s ) { return s + s; } );
        };
        height = height || width;
        bg = bg || 'ccc';
        color = color || '000';
        text = text || ( width + 'X' + height );

        // return 'http://dummyimage.com/'+width+'x'+height+'/'+bg+'/'+color+'.png&text=' + text;
        // return 'http://fakeimg.pl/'+width+'x'+height+'/'+bg+'/'+color+'/?text=' + text;

        // 不支持三位颜色的，变换成六位
        if ( bg.length == 3 ) bg = colorTrans( bg );
        if ( color.length == 3 ) color = colorTrans( color );

        // return 'http://fpoimg.com/'+width+'x'+height+'?bg_color='+bg+'&text_color='+color+'&text=' + text;
        return "//placeholdit.imgix.net/~text?txtsize=33&txt=" + text + "&w=" + width + "&h=" + height + "&bg=" + bg + "&txtcolor=" + color;
      }
    }
  }, req.app.ext.dist.bind( { req: req, res: res, distPath: url_path } ) );
} );

module.exports = router;
