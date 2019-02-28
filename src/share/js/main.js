window.__version__ = document.getElementById( "requirejs" ).getAttribute( "data-version" );
require.config( {
  baseUrl: "./",
  urlArgs: __version__,
  map: { "*": { css: "public/require-css.js" } },
  paths: {
    jquery: "public/js/jquery"
  },
  shim: {
    jquery: [
      "public/js/es5-shim",
      "public/js/es6-shim"
    ]
  }
} );
define( "app/404", function() {
  return '<div class="imgc" style="height:100%;">' + '<div class="imge">您访问的网页不存在，<a href="#/index">返回首页</a></div>' + "</div>";
} );
define( "app/router", [
  "public/js/router",
  "app/404"
], function( director, html_404 ) {
  return function( app ) {
    return director
      .Router( {
        "/404": {
          before: app.fullScreen,
          after: app.exitFullScreen,
          on: function( next ) {
            document.title = "404 Not Found";
            new EJS( {
              text: html_404
            } ).update( app.root, {
              data: {}
            } );
            next();
          }
        }
      } )
      .configure( {
        async: true,
        recurse: "forward",
        notfound: function() {
          // app.router.setRoute('404');
          app.router.dispatch( "on", "/404" );
        }
      } );
  };
} );
require( [
  "jquery",
  // 'public/fetch',
  // 'public/web-animations',
  "app/router",
  "public/js/ejs"
], function( $, app_router ) {
  var app = {
    root: document.getElementById( "page" ),
    boot: function() {
      this.router = app_router( this );
      this.define_router_param();
      this.config_router();
      this.global_router();
      this.router.init( "index" );
    },
    fullScreen: function( next ) {
      $( "html" ).addClass( "full-screen" );
      next && next();
    },
    exitFullScreen: function( next ) {
      $( "html" ).removeClass( "full-screen" );
      next && next();
    },
    define_router_param: function() {
      var router = this.router;
      router.param( "id", /([\d]+)/ );
      router.param( "index", /([\w]+)/ );
    },
    global_router: function() {
      var router = this.router;
      router.on( "on", "/?(.*)", function( path, next ) {
        var destroy_previous_page = function() {
          if ( app.page ) app.page.destroy();
          $( app.root ).empty();
        };
        new Promise( function( resolve, reject ) {
          var module = "share/js/" + ( path || "index" );
          require( [ module ], resolve, function() {
            return reject( 404 );
          } );
        } )
          .then( function( page ) {
            destroy_previous_page();
            if ( !page ) return Promise.reject( 404 );
            page.option = {
              router: router,
              path: path,
              next: next,
              app: app
            };
            page.create();
            app.page = page;
          } )
          [ "catch" ]( function() {
            destroy_previous_page();
            router.dispatch( "on", "/404" );
          } );
      } );
    },
    config_router: function() {
      var router = this.router;
      router.on( "on", "/article/:index", function( article_index, next ) {
        require.config( {
          shim: {
            "public/js/highlight": { exports: "hljs" }
          }
        } );
        require( [
          "jquery",
          "public/js/markdown-it",
          "public/js/highlight",
          "share/tpl/article/" + article_index + ".markdown"
        ], function( $, markdown, hljs, article ) {
          if ( !article ) return router.dispatch( "on", "/404" );
          app.exitFullScreen();
          var md = new markdown().set( { html: true, breaks: true } );
          article = md.render( article[ article_index + ".markdown" ] );
          new EJS( {
            text: '<div class="article-page"><div class="article-bar article-header"><div class="wrap"><a href="#/index">首页</a> <a href="#/article/markdown">本文链接</a></div></div><div class="markdown-body md-ctn wrap"><%=data%></div><div class="article-bar article-footer"><div class="wrap"><a href="#/index">首页</a> <a href="/#/article/markdown">本文链接</a></div></div></div>'
          } ).update( app.root, {
            data: article,
            home: "#/index"
          } );
          document.title = document.querySelector( "h1" ).innerHTML;
          $( "pre code" ).each( function( i, block ) {
            hljs.highlightBlock( block );
          } );
          next();
        }, function() {
          router.dispatch( "on", "/404" );
        } );
      } );
    }
  };
  app.boot();
} );
// vim: fdm=marker
