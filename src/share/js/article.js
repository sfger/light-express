define( function( require, exports, module ) {
  var page = {
    create: function() {
      var option = this.option;
      document.title = "Article list";
      new EJS( {
        text: '<a href="#/article/markdown">Markdown语法</a>'
      } ).update( option.app.root, {
        data: {}
      } );
      option.next();
    },
    destroy: function() {}
  };
  module.exports = page;
} );
