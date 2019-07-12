/* String */
/* *
 * @param[in] str 日期字符串 如：2012-12-12 12:12:21
 * @return 返回时间戳
 */
function strtotime( str ) {
  // if(!str || (typeof str.replace != 'function')) return false;
  return Date.parse( str.replace( /-/g, "/" ) ) / 1000;
}
/* *
 * @param[in] n 被填冲的字符串
 * @param[in] c 要填冲的长度
 * @param[in] s 要填冲的字符
 * @return 填冲后的字符串
 */
function pad( n, c, s ) {
  s = s || "0";
  if ( ( n = n + "" ).length < c ) {
    return new Array( ++c - n.length ).join( s ) + n;
  }
  return n;
}
/* *
 * @param[in] format 格式化的格式
 * @param[in] timestamp 时间戳
 * @return 格式化后的字符串
 */
function date( format, timestamp ) {
  // doc http://php.net/manual/zh/function.date.php
  var jsdate = timestamp ? new Date( timestamp * 1000 ) : new Date();
  var txt_weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" };
  var txt_months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  var f = {
    // Day
    d: function() {
      return pad( f.j(), 2 );
    },
    D: function() {
      return f.l().substr( 0, 3 );
    },
    j: function() {
      return jsdate.getDate();
    },
    l: function() {
      return txt_weekdays[ f.w() ];
    },
    N: function() {
      return f.w() + 1;
    },
    S: function() {
      return txt_ordin[ f.j() ] ? txt_ordin[ f.j() ] : "th";
    },
    w: function() {
      return jsdate.getDay();
    },
    z: function() {
      return ( ( jsdate - new Date( jsdate.getFullYear() + "/1/1" ) ) / 864e5 ) >> 0;
    },

    // Week
    W: function() {
      var a = f.z(),
        b = 364 + f.L() - a;
      var nd2,
        nd = ( new Date( jsdate.getFullYear() + "/1/1" ).getDay() || 7 ) - 1;
      if ( b <= 2 && ( jsdate.getDay() || 7 ) - 1 <= 2 - b ) {
        return 1;
      } else {
        if ( a <= 2 && nd >= 4 && a >= 6 - nd ) {
          nd2 = new Date( jsdate.getFullYear() - 1 + "/12/31" );
          return date( "W", Math.round( nd2.getTime() / 1000 ) );
        } else {
          return ( 1 + ( nd <= 3 ? ( a + nd ) / 7 : ( a - ( 7 - nd ) ) / 7 ) ) >> 0;
        }
      }
    },

    // Month
    F: function() {
      return txt_months[ f.n() ];
    },
    m: function() {
      return pad( f.n(), 2 );
    },
    M: function() {
      return f.F().substr( 0, 3 );
    },
    n: function() {
      return jsdate.getMonth() + 1;
    },
    t: function() {
      var n;
      if ( ( n = jsdate.getMonth() + 1 ) == 2 ) {
        return 28 + f.L();
      } else {
        if ( ( n & 1 && n < 8 ) || ( !( n & 1 ) && n > 7 ) ) {
          return 31;
        } else {
          return 30;
        }
      }
    },

    // Year
    L: function() {
      var y = f.Y();
      return !( y & 3 ) && ( y % 1e2 || !( y % 4e2 ) ) ? 1 : 0;
    },
    // o not supported yet
    Y: function() {
      return jsdate.getFullYear();
    },
    y: function() {
      return ( jsdate.getFullYear() + "" ).slice( 2 );
    },

    // Time
    a: function() {
      return jsdate.getHours() > 11 ? "pm" : "am";
    },
    A: function() {
      return f.a().toUpperCase();
    },
    B: function() {
      // peter paul koch:
      var off = ( jsdate.getTimezoneOffset() + 60 ) * 60;
      var theSeconds = jsdate.getHours() * 3600 + jsdate.getMinutes() * 60 + jsdate.getSeconds() + off;
      var beat = Math.floor( theSeconds / 86.4 );
      if ( beat > 1000 ) beat -= 1000;
      if ( beat < 0 ) beat += 1000;
      if ( String( beat ).length == 1 ) beat = "00" + beat;
      if ( String( beat ).length == 2 ) beat = "0" + beat;
      return beat;
    },
    g: function() {
      return jsdate.getHours() % 12 || 12;
    },
    G: function() {
      return jsdate.getHours();
    },
    h: function() {
      return pad( f.g(), 2 );
    },
    H: function() {
      return pad( jsdate.getHours(), 2 );
    },
    i: function() {
      return pad( jsdate.getMinutes(), 2 );
    },
    s: function() {
      return pad( jsdate.getSeconds(), 2 );
    },
    // u not supported yet

    // Timezone
    // e not supported yet
    // I not supported yet
    O: function() {
      var t = pad( Math.abs( ( jsdate.getTimezoneOffset() / 60 ) * 100 ), 4 );
      if ( jsdate.getTimezoneOffset() > 0 ) t = "-" + t;
      else t = "+" + t;
      return t;
    },
    P: function() {
      var O = f.O();
      return O.substr( 0, 3 ) + ":" + O.substr( 3, 2 );
    },
    // T not supported yet
    // Z not supported yet

    // Full Date/Time
    c: function() {
      return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P();
    },
    // r not supported yet
    U: function() {
      return Math.round( jsdate.getTime() / 1000 );
    }
  };

  return format.replace( /[\\]?([a-zA-Z])/g, function( t, s ) {
    var ret = "";
    if ( t != s ) {
      // escaped
      ret = s;
    } else if ( f[ s ] ) {
      // a date function exists
      ret = f[ s ]();
    } else {
      // nothing special
      ret = s;
    }
    return ret;
  } );
}

function getType( obj ) {
  return Object.prototype.toString
    .call( obj )
    .slice( 8, -1 )
    .toLowerCase();
}

function createElement( node ) {
  var cd = "",
    at = [],
    attr = null,
    children = null,
    fn = createElement,
    node_type = getType( node );
  if ( node_type === "array" ) {
    for ( var j in node ) cd += fn( node[ j ] );
  } else {
    if ( node_type === "string" || node_type == "number" ) {
      cd = node;
    } else if ( node_type === "object" && node.name ) {
      ( attr = node.attr ), ( children = node.children ), ( at = [] );
      if ( attr ) {
        for ( var key in attr ) {
          if ( key == "className" ) {
            at.push( 'class="' + attr[ key ] + '"' );
            continue;
          } else if ( key == "style" ) {
            var style = attr[ key ];
            var ot = getType( style );
            attr[ key ] = "";
            if ( ot == "object" ) {
              for ( var sk in style ) {
                attr[ key ] += sk + ":" + style[ sk ] + ";";
              }
            } else if ( ot == "string" ) {
              attr[ key ] = style;
            }
          }
          at.push( "" + key + '="' + attr[ key ] + '"' );
        }
      }
      if ( at.length ) at.unshift( "" );
      if ( children && getType( children ) !== "array" ) children = [ children ];
      cd = "<" + node.name + at.join( " " ) + ">" + ( children ? fn( children ) : "" ) + "</" + node.name + ">";
    } else cd = "";
  }
  return cd;
}

function numberFormat( n, x, c ) {
  if ( isNaN( n ) ) return n;
  ( n = n || 0 ), ( x = x || 0 ), ( c = c || 3 );
  n = Number( n ).toFixed( x );
  var end = x === 0 ? "$" : "\\.";
  return n.replace( new RegExp( "\\B(?=(\\d{" + c + "})+(?=" + end + "))", "g" ), "," );
}
// console.log(numberFormat(22222222.22222, 5, 3));
function numberFromFormat( str ) {
  return Number( str.replace( /,/g, "" ) );
}

function buildRegString( s ) {
  if ( !s ) return s;
  return String( s ).replace( /[()^$*?+.-\\]/g, function( i ) {
    return "\\" + i;
  } );
}

function isStrHasTrunkWith( str, trunk, delimeter ) {
  trunk = buildRegString( trunk );
  if ( delimeter ) {
    delimeter = buildRegString( delimeter );
    return new RegExp( "([" + delimeter + "]|^)" + trunk + "([" + delimeter + "]|$)" ).test( str );
  } else return new RegExp( trunk ).test( str );
}
/* *
 * @time : setTimeout的延迟时间
 * @fn   : 延迟执行的函数
 * @arg  : 要传给fn函数的参数
 */
function wait( time ) {
  return new Promise( resolve => setTimeout( resolve, time ) );
}
// var title = "ECCO Men's Darren High Moonless 43 (US Men's 9-9.5) D - Medium";
// var one = "43 (US Men's 9-9.5)";
// console.log( isStrHasTrunkWith(title, title, ' ') );
function domCountDown( option ) {
  var that = this;
  var get_timestamp = function() {
    return parseInt( +new Date() / 1000, 10 );
  };
  var etime = get_timestamp() + option.time;
  var timer_fn = function() {
    clearTimeout( that.__count_down_timer__ );
    var second = etime - get_timestamp();
    option.render.innerHTML = option.formatter( second );
    if ( second > 0 ) {
      that.__count_down_timer__ = setTimeout( timer_fn, 1000 );
    } else {
      option.onCountComplete();
    }
  };
  that.__count_down_timer__ = setTimeout( function() {
    timer_fn();
  }, 0 );
  return true;
}
// var instance = new domCountDown({
// 	render: dom_node,
// 	time: 5,
// 	formatter: function(second){
// 		return '还有'+second+'秒开始下单';
// 	},
// 	onCountComplete: function(){
// 		dom_node.innerHTML = '结束';
// 	}
// });
/* *
 * debounce 和 throttle 来自underscore
 */
function restArgs( func, startIndex ) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var length = Math.max( arguments.length - startIndex, 0 ),
      rest = Array( length ),
      index = 0;
    for ( ; index < length; index++ ) {
      rest[ index ] = arguments[ index + startIndex ];
    }
    switch ( startIndex ) {
      case 0:
        return func.call( this, rest );
      case 1:
        return func.call( this, arguments[ 0 ], rest );
      case 2:
        return func.call( this, arguments[ 0 ], arguments[ 1 ], rest );
    }
    var args = Array( startIndex + 1 );
    for ( index = 0; index < startIndex; index++ ) {
      args[ index ] = arguments[ index ];
    }
    args[ startIndex ] = rest;
    return func.apply( this, args );
  };
}
var delay = restArgs( function( func, wait, args ) {
  return setTimeout( function() {
    return func.apply( null, args );
  }, wait );
} );

function debounce( func, wait, immediate ) {
  var timeout, result;

  var later = function( context, args ) {
    timeout = null;
    if ( args ) result = func.apply( context, args );
  };

  var debounced = restArgs( function( args ) {
    if ( timeout ) clearTimeout( timeout );
    if ( immediate ) {
      var callNow = !timeout;
      timeout = setTimeout( later, wait );
      if ( callNow ) result = func.apply( this, args );
    } else {
      timeout = delay( later, wait, this, args );
    }

    return result;
  } );

  debounced.cancel = function() {
    clearTimeout( timeout );
    timeout = null;
  };

  return debounced;
}

function throttle( func, wait, options ) {
  var timeout, context, args, result;
  var previous = 0;
  if ( !options ) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply( context, args );
    if ( !timeout ) context = args = null;
  };

  var throttled = function() {
    var now = Date.now();
    if ( !previous && options.leading === false ) previous = now;
    var remaining = wait - ( now - previous );
    context = this;
    args = arguments;
    if ( remaining <= 0 || remaining > wait ) {
      if ( timeout ) {
        clearTimeout( timeout );
        timeout = null;
      }
      previous = now;
      result = func.apply( context, args );
      if ( !timeout ) context = args = null;
    } else if ( !timeout && options.trailing !== false ) {
      timeout = setTimeout( later, remaining );
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout( timeout );
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

function isPlainObject( obj ) {
  if ( getType( obj ) !== "object" || obj.nodeType || isWindow( obj ) ) return false;
  try {
    if ( obj.constructor && !Object.prototype.hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" ) ) return false;
  } catch ( e ) {
    return false;
  }
  return true;
}

function isFunction( obj ) {
  return getType( obj ) === "function";
}
var isArray =
  Array.isArray ||
  function( obj ) {
    return getType( obj ) === "array";
  };

/* Object */
function extend() {
  var src, copyIsArray, copy, name, options, clone;
  var target = arguments[ 0 ] || {},
    i = 1,
    length = arguments.length,
    deep = false;
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[ i ] || {};
    i++;
  }
  if ( typeof target !== "object" && !isFunction( target ) ) {
    target = {};
  }
  if ( i === length ) {
    target = this;
    i--;
  }
  for ( ; i < length; i++ ) {
    if ( ( options = arguments[ i ] ) != null ) {
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];
        if ( target === copy ) {
          continue;
        }
        if ( deep && copy && ( isPlainObject( copy ) || ( copyIsArray = isArray( copy ) ) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && isArray( src ) ? src : [];
          } else {
            clone = src && isPlainObject( src ) ? src : {};
          }
          target[ name ] = extend( deep, clone, copy );
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }
  return target;
}

/* BOM|Browser */
function isWindow( obj ) {
  // 判断是否为window对象
  return obj != null && obj == obj.window;
}

/* DOM|Browser */
function getCurrentScript() {
  if ( document.currentScript ) return document.currentScript;
  var stack;
  try {
    /* eslint-disable */
    a.b.c();
    /* eslint-enable */
  } catch ( e ) {
    stack = e.stack;
    if ( !stack && window.opera ) {
      stack = ( String( e ).match( /of linked script \S+/g ) || [] ).join( " " );
    }
  }
  if ( stack ) {
    stack = stack.split( /[@ ]/g ).pop();
    stack = stack[ 0 ] == "(" ? stack.slice( 1, -1 ) : stack;
    return stack.replace( /(:\d+)?:\d+$/i, "" );
  }
  var nodes = document.getElementsByTagName( "script" );
  for ( var i = 0, node; ( node = nodes[ i++ ] ); ) {
    if ( node.readyState === "interactive" ) {
      // return node.className = node;
      return node;
    }
  }
}

// var test = extend( true, {
// 	a: 1,
// 	b: { a: 1, b: [4], c: [] }
// }, {
// 	a: 3,
// 	b: { b: [ 1, 2, 3 ] }
// } );
// console.log( JSON.stringify( test ) );

export { pad, wait, date, extend, getType, debounce, throttle, isWindow, strtotime, numberFormat, domCountDown, createElement, isPlainObject, buildRegString, numberFromFormat, getCurrentScript, isStrHasTrunkWith };
