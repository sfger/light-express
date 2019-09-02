let path = require( "path" );
let root = path.resolve( __dirname );
module.exports = {
  alias: {
    "@": "/components/",
    "~": "/src/"
  },
  includePaths: [ root + "/node_modules/" ],
  importer: function( url, prev ) {
    let leading = url.charAt( 0 );
    let map = this.options.alias;
    if ( leading in map ) {
      url = path.normalize( root + map[ leading ] + url.slice( 1 ) );
      url = path.relative( path.dirname( prev ), url );
    }
    return { file: url };
  },
  indentWidth: 1,
  linefeed: "lf",
  indentType: "tab",
  outputStyle: "compact"
};
