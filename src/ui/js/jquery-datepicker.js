// vim: fdm=marker
( function ( root, factory ) {
  'use strict';
  if ( typeof define === 'function' && define.amd ) {
    define( [
      'jquery',
      'date-helper'
    ], factory );
  } else if ( typeof exports === 'object' ) {
    module.exports = factory();
  } else {
    factory( jQuery );
  }
}( this, function ( $, date_helper ) {
  $.fn.datePicker = function ( o ) {
    var op = $.extend( true, {
      type: 'date', // date|dateTime
      monthNum: 1,
      proxy: $( 'body' ),
      onComplete: function () {}
    }, o );
    /* beautify preserve:start */
    var tpl = '<div class="dtp-ctn">' +
			'<a href="javascript:" class="dtp-switcher dtp-prev">&lt;</a>' +
			'<ul class="dtp-header">' +
				'<li></li>' +
			'</ul>' +
			'<a href="javascript:" class="dtp-switcher dtp-next">&gt;</a>' +
			'<div class="dtp-list">' +
				'<div class="dtp-item">' +
					'<ul class="dtp-wh">' +
						'<li class="item day weekend">日</li>' +
						'<li class="item day">一</li>' +
						'<li class="item day">二</li>' +
						'<li class="item day">三</li>' +
						'<li class="item day">四</li>' +
						'<li class="item day">五</li>' +
						'<li class="item day weekend">六</li>' +
					'</ul>' +
					'<ul class="dtp-wd"></ul>' +
				'</div>' +
			'</div>' +
			'<div class="dtp-time">' +
				'<span>时间: </span>' +
				'<label class="dtp-hour">' +
					'<span>小时:</span>' +
					'<input type="text" value="" />' +
					'<ul></ul>' +
				'</label>' +
				'<span> : </span>' +
				'<label class="dtp-minute">' +
					'<span>分钟:</span>' +
					'<input type="text" value="" />' +
					'<ul></ul>' +
				'</label>' +
			'</div>' +
		'</div>';
    /* beautify preserve:end */

    function date_parser( str ) {
      var parse_timer_array = str.split( /[ \-:]/ );
      for ( var x = 0; x < parse_timer_array.length; x++ ) {
        parse_timer_array[ x ] = Number( parse_timer_array[ x ] );
        if ( x == 1 ) parse_timer_array[ x ] = parse_timer_array[ x ] - 1;
      }
      return Date.UTC.apply( null, parse_timer_array ) / 1000 + ( new Date().getTimezoneOffset() * 60 );
    }

    function draw_ui( val, render ) {
      var n;
      var ret = $( tpl );
      var dh = date_helper().set_date( val );
      var init_date = new date_helper( render.value ? date_parser( render.value ) : '' );

      if ( 'dateTime' === op.type || 'dateHour' === op.type ) {
        $( '.dtp-time', ret ).show();
        $( '.dtp-hour input', ret ).attr( 'value', init_date.php_date( 'H' ) );
        $( '.dtp-minute input', ret ).attr( 'value', init_date.php_date( 'i' ) );

        $( '.dtp-hour ul', ret ).append( function () {
          var s = '';
          for ( var i = 0; i < 24; i++ ) s += '<li>' + date_helper.pad( i, 2 ) + '</li>';
          return s;
        } );

        $( '.dtp-minute ul', ret ).append( function () {
          var s = '';
          for ( var i = 0; i < 60; i++ ) s += '<li>' + date_helper.pad( i, 2 ) + '</li>';
          return s;
        } );

      }

      if ( op.monthNum > 1 ) {
        var $ul = ret.find( '.dtp-header' );
        var $list = ret.find( '.dtp-list' );
        for ( n = 0; n < op.monthNum - 1; n++ ) {
          $ul.append( $ul.find( 'li' ).eq( 0 ).clone() );
          $list.append( $list.find( '.dtp-item' ).eq( 0 ).clone() );
        }
      }

      for ( n = 0; n < op.monthNum; n++ ) {
        var abd;
        if ( op.minDate ) {
          switch ( typeof op.minDate ) {
            case 'string':
              abd = op.minDate;
              break;
            case 'function':
              abd = op.minDate();
              break;
            default:
              break;
          }
        }
        var sdate = dh.get_first_date_of_month(); // First date
        var sday = sdate.php_date( 'w' ); // First date's day
        var total = sdate.php_date( 't' ); // Total days
        var ii = 1; // 第几天
        var dl = ''; // li elements string

        for ( var i = 0; i < 42; i++ ) {
          var sc = ''; // element class
          var fd = sdate.php_date( 'Y-m-' + date_helper.pad( ii, 2 ) );
          if ( abd && fd < abd ) sc = ' class="disabled"';
          else if ( i < sday || ii > total ) sc = ' class="disabled"';
          else if ( fd == init_date.current_date ) sc = ' class="selected"';
          var show = i < sday || ii > total ? date_helper.date( 'j', sdate.current_timestamp + ( -sday + i ) * 86400 ) : ii++; // 显示日期
          dl += '<li' + sc + '>' + show + '</li>';
        }
        $( '.dtp-header li', ret ).eq( n ).html( '<dfn>' + sdate.php_date( 'Y' ) + '</dfn>' + '<span>年</span><dfn>' + sdate.php_date( 'n' ) + '</dfn>' + '<span>月</span>' );
        $( '.dtp-wd', ret ).eq( n ).append( dl );
        $( '.dtp-item', ret ).eq( 0 ).css( { borderColor: 'white' } );
        if ( render && render.ui && render.ui.renderTo ) render.ui.renderTo.innerHTML = ret.html();
        else ret.appendTo( 'body' );
        dh.get_offset_date( 1, 'm' );
      }
      return ret.get( 0 );
    }

    function set_date_val( input, li ) {
      var value = li ? date_helper( input.ui.skipdate ).get_first_date_of_month().get_offset_date( $( li ).closest( '.dtp-item' ).index(), 'm' ).get_offset_date( Number( li.innerHTML - 1 ) ).current_date : input.value.split( ' ' )[ 0 ];
      if ( op.type === 'dateTime' ) value += ' ' + $( input.ui.renderTo ).find( '.dtp-hour input' ).val() + ':' + $( input.ui.renderTo ).find( '.dtp-minute input' ).val();
      input.value = value;
    }
    return this.each( function () {
      var that = this;
      var val = this.value;
      this.ui = {
        hovered: false,
        skipdate: val,
        renderTo: draw_ui( val, that )
      };
      $( this.ui.renderTo ).css( {
        position: 'absolute',
        left: $( that ).position().left,
        top: $( that ).position().top + that.offsetHeight
      } );
      $( this.ui.renderTo ).on( {
        click: function () {
          that.ui.skipdate = date_helper( that.ui.skipdate ).get_offset_date( -Number( op.monthNum ), 'm' ).current_date;
          draw_ui( that.ui.skipdate, that );
        }
      }, '.dtp-prev' ).on( {
        click: function () {
          that.ui.skipdate = date_helper( that.ui.skipdate ).get_offset_date( Number( op.monthNum ), 'm' ).current_date;
          draw_ui( that.ui.skipdate, that );
        }
      }, '.dtp-next' ).on( {
        click: function () {
          set_date_val( that, this );
          $( that.ui.renderTo ).hide();
          op.onComplete && op.onComplete.call( that, that.value );
        }
      }, '.dtp-wd li:not(".disabled")' ).on( {
        'mouseenter click': function () {
          that.ui.hovered = true;
        },
        mouseleave: function () {
          that.ui.hovered = false;
        }
      } );
      $( this ).on( {
        'focus click': function () {
          op.proxy.trigger( 'click' );
          draw_ui( this.value, this );
          this.ui.hovered = true;
          this.ui.skipdate = this.value;
          $( this.ui.renderTo ).show();
        },
        'blur': function () {
          this.ui.hovered = false;
        }
      } );
      // $(this.ui.renderTo).on({
      // 	click: function(){
      // 		$(that.ui.renderTo).show();
      // 		that.ui.hovered = true;
      // 		return false;
      // 	}
      // });
      op.proxy.on( {
        click: function () {
          if ( !that.ui.hovered ) {
            $( that.ui.renderTo ).hide();
          }
        }
      } );

      $( this.ui.renderTo ).on( {
        'focus click': function () {
          var $this = $( this );
          var $ul = $this.next();
          $ul.find( 'li' ).removeClass( 'selected' ).eq( this.value ).addClass( 'selected' );
          $ul.show().closest( 'label' ).siblings().find( 'ul' ).hide();
        },
        'blur': function () {
          var $ul = $( this ).next();
          this._not_to_hide || setTimeout( function () { $ul.hide(); }, 230 );
          delete this._not_to_hide;
        }
      }, '.dtp-time input' ).on( {
        'mousedown': function () {
          var $input = $( this ).closest( 'ul' ).prev();
          $input.get( 0 )._not_to_hide = true;
        },
        'click': function () {
          var $li = $( this );
          var $ul = $li.closest( 'ul' );
          var $input = $ul.prev();
          $input.val( $.trim( $li.text() ) );
          set_date_val( that );
          setTimeout( function () { $ul.hide(); }, 1 );
        }
      }, '.dtp-time li' );
    } );
  };
} ) );
