var React = require( 'react' );
class Html extends React.Component {
  constructor( props ) {
    super( props );
  }
  render() {
    let { __version__ } = this.props;
    return (
      <html lang="zh-CN">
        <head>
          <meta charSet="UTF-8" />
          <meta name="renderer" content="webkit" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <title>Title</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-touch-fullscreen" content="yes" />
          <meta name="format-detection" content="telephone=no, email=no" />
          <meta name="screen-orientation" content="portrait" />
          <meta name="full-screen" content="yes" />
          <meta name="browsermode" content="application" />
          <meta name="x5-orientation" content="portrait" />
          <meta name="x5-fullscreen" content="true" />
          <meta name="x5-page-mode" content="app" />
          <meta name="author" content="" />
          <meta name="revisit-after" content="1 days" />
          <meta name="keywords" content="" />
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="stylesheet" type="text/css" href={"./css/react.css?" + __version__ } />
        </head>
        <body>
          <div id="page">
          </div>
          <script>
            var test = 1;
          </script>
          <script src="../../../../public/js/es5-shim.js"></script>
          <script src="../../../../public/js/es5-sham.js"></script>
          <script src="../../../../public/js/es6-shim.js"></script>
          <script id="mainjs" data-version={ __version__ } data-main={ './js/context.js?' + __version__ } src={ '../public/js/require.js?' + __version__ }></script>
        </body>
      </html>
    );
  }
}
module.exports = Html;
