$.fn.scrollbar = function( options ) {
  var type = $.type( options );
  if ( type === "string" ) {
    var args = Array.prototype.slice.call( arguments ).slice( 1 );
    this.each( function() {
      var ui = $( this ).data( "ui" );
      if ( ui && ui.iScrollbar ) {
        ui.iScrollbar[ options ].apply( ui.iScrollbar, args );
      } else {
        throw new Error( "UI:scrollbar does not init..." );
      }
    } );
    return true;
  }
  options = $.extend( true, {}, options );
  var handler = function( box, options ) {
    return new handler.prototype.init( box, options );
  };
  handler.prototype = {
    init: function( box ) {
      this.render = box;
      $( box )
        .addClass( "scrollbar-ctn" )
        .append( '<div class="scrollbar-outter"><div class="scrollbar-inner"></div></div>' );
      var cnt = $( box )
        .children()
        .get( 0 );
      if ( cnt.scrollHeight <= cnt.offsetHeight ) return false;
      $( cnt ).addClass( "scrollbar-cnt" );

      function adjust_scroll_bar() {
        var bar, cnt;
        $( ">.scrollbar-outter>.scrollbar-inner", box ).css( "height", function() {
          cnt = this.parentNode.parentNode.children[ 0 ];
          bar = this;
          bar.style.top = 0;
          var percent = ( cnt.clientHeight / cnt.scrollHeight ) * 100;
          if ( percent == 100 ) return 0;
          return percent + "%";
        } );
        bar.style.top = cnt.scrollTop + "px";
        set_scroll_bar_top.call( box );
      }
      adjust_scroll_bar();

      function set_scroll_bar_top( e ) {
        if ( $( this ).is( ":animated" ) ) return false;
        var _sh = this.scrollTop;
        if ( e ) {
          var originalEvent = e.originalEvent;
          _sh = this.scrollTop - ( originalEvent.wheelDelta || -( originalEvent.detail / 3 ) * 120 ) / 1.15;
        }
        var scroll_height = this.scrollHeight - this.clientHeight;
        _sh = _sh > scroll_height ? scroll_height : _sh;
        _sh = _sh < 0 ? 0 : _sh;
        var top_val = ( _sh / this.scrollHeight ) * this.clientHeight;
        var time = ( e && 230 ) || 0;
        // this.querySelector('.scrollbar-outter').style.top = _sh + 'px';
        $( ">.scrollbar-outter>.scrollbar-inner", box ).animate( { top: top_val + "px" }, time );
        if ( e ) $( this ).animate( { scrollTop: "+" + _sh + "px" }, time );
        if ( _sh !== this.scrollTop ) {
          return false;
        }
      }
      $( box ).on( "mousewheel DOMMouseScroll", ">.scrollbar-cnt", set_scroll_bar_top );
    }
  };
  handler.prototype.init.prototype = handler.prototype;
  return this.each( function() {
    var $this = $( this );
    var instance = handler( this, $.extend( true, {}, options ) );
    var ui = $this.data( "ui" );
    if ( ui ) ui.iScrollbar = instance;
    else $this.data( "ui", { iScrollbar: instance } );
  } );
};
