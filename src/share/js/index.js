define( function ( require, exports, module ) {
  module.exports = {
    create: function () {
      var option = this.option;
      option.app.fullScreen();
      document.title = 'Share From Water';
      require( [ 'share/tpl/index.tpl' ], function ( data ) {
        new EJS( {
          text: data[ 'index.tpl' ]
        } ).update( option.app.root, {
          data: {
            __version__: __version__
          }
        } );
        option.next();
      } );
    },
    destroy: function () {
      this.option.app.exitFullScreen();
    }
  };
} );
