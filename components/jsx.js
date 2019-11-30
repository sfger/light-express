let singleTagList = "br,img,input".split( "," );

let templateTagList = "Fragment".split( "," );

let ignoreProperties = { key: 1 };

let mapProperties = { className: "class", htmlFor: "for" };

function getType( obj ) {
  return Object.prototype.toString
    .call( obj )
    .slice( 8, -1 )
    .toLowerCase();
}

function isWindow( obj ) {
  return obj != null && obj == obj.window;
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

function isArray( item ) {
  return item instanceof Array;
}

function ArrayUnique( list ) {
  let ret = [];
  for ( let item of list ) {
    if ( ~ret.indexOf( item ) ) continue;
    ret.push( item );
  }
  return ret;
}

function setClassNameList( value ) {
  let type = getType( value );
  let ret = [];
  if ( "string" == type ) {
    ret = ArrayUnique( value.split( /\s+/ ) );
  } else if ( isArray( value ) ) {
    for ( let item of value ) ret = ret.concat( setClassNameList( item ) );
  } else if ( isPlainObject( value ) ) {
    for ( let key in value ) {
      if ( value[ key ] ) ret.push( key );
    }
  } else {
    throw new Error( `JSX Property className does not support the value type: ${ value }` );
  }
  return ArrayUnique( ret );
}

function setClassName( list ) {
  return setClassNameList( list ).join( " " );
}

// console.log(
//   setClassName( [
//     {
//       test: 1,
//       best: 1
//     },
//     "test",
//     "b",
//     "a",
//     "c"
//   ] )
// );
// process.exit();

function setStyle( style ) {
  let type = getType( style );
  if ( "string" == type ) return style;
  if ( !isPlainObject( style ) ) throw new Error( `JSX Property style does not support the value type: ${ style }` );
  let ret = [];
  for ( let property in style ) {
    let value = style[ property ];
    if ( value ) ret.push( `${ property }:${ value };` );
  }
  return ret.join( "" );
}

function setAttrs( attrs ) {
  if ( !attrs ) return "";
  let ret = [];
  for ( let property in attrs ) {
    if ( ignoreProperties[ property ] ) continue;
    let value = attrs[ property ];
    property = mapProperties[ property ] || property;
    if ( ~[
      "class",
      "className"
    ].indexOf( property ) ) value = setClassName( value );
    if ( "style" == property ) value = setStyle( value );
    if ( property ) ret.push( `${ property }="${ value }"` );
  }
  let str = ret.join( " " );
  if ( str ) str = " " + str;
  return str;
}

function setChildren( list ) {
  if ( !isArray( list ) ) return list;
  return list
    .map( function( item ) {
      if ( isArray( item ) ) return setChildren( item );
      return item;
    } )
    .join( "" );
}

function JSX( name, attrs, ...children ) {
  if ( !attrs ) attrs = {};
  children = setChildren( children );
  if ( ~templateTagList.indexOf( name ) ) return children;
  if ( ~singleTagList.indexOf( name ) ) return `<${ name } ${ setAttrs( attrs ) } />`;
  let type = typeof name;
  if ( type == "string" ) return `<${ name }${ setAttrs( attrs ) }>${ children }</${ name }>`;
  if ( type == "function" ) return setChildren( name( { ...attrs, children } ) );
  return "";
}

export default JSX;
