require.config( {
  baseUrl: "../js/",
  // urlArgs:"v=" + document.getElementById("requirejs").getAttribute("data-version"),
  map: { "*": { css: "require-css.js" } },
  paths: {},
  shim: {
    "markdown-it": { deps: [ "ecmaShim" ] },
    highlight: { deps: [ "ecmaShim" ], exports: "hljs" }
  }
} );
require( [
  "jquery",
  "markdown-it",
  "highlight",
  "ecmaShim"
], function( $, markdown, hljs ) {
  if ( !document.querySelectorAll ) document.querySelectorAll = $;
  var md = new markdown().set( { html: true, breaks: true } );
  var show_markdown = function( data ) {
    console.log( data );
    $( ".md-ctn" ).html( md.render( data ) );
    $( "pre code" ).each( function( i, block ) {
      hljs.highlightBlock( block );
    } );
  };
  // new Promise(function(resolve, reject){
  // 	$.ajax({
  // 		url: '/md/test.md',
  // 		success: function(data){
  // 			resolve(data);
  // 		}
  // 	});
  // }).then(show_markdown);
  try {
    $.ajax( {
      url: "../md/test.md",
      success: show_markdown,
      error: function( a, b, c ) {
        console.log( a, b, c );
      }
    } );
  } catch ( e ) {
    console.log( e );
  }
} );
