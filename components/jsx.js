let singleTagList = "br,img,input".split( "," );

let templateTagList = "template,Fragment".split( "," );

let ignoreKeys = { key: 1 };

let mapKeys = { className: "class", htmlFor: "for" };

function isArray( item ) {
  return item instanceof Array;
}

function setAttrs( attrs ) {
  if ( !attrs ) return "";
  let ret = "";
  for ( let key in attrs ) {
    if ( ignoreKeys[ key ] ) continue;
    if ( key ) ret += " " + ( mapKeys[ key ] || key ) + '="' + attrs[ key ] + '"';
  }
  return ret;
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
  children = setChildren( children );
  if ( ~templateTagList.indexOf( name ) ) return children;
  if ( ~singleTagList.indexOf( name ) ) return "<" + name + setAttrs( attrs ) + " />";
  let type = typeof name;
  if ( type == "string" ) return "<" + name + setAttrs( attrs ) + ">" + children + "</" + name + ">";
  if ( type == "function" ) return setChildren( name( attrs, children ) );
  return "";
}

export default JSX;
