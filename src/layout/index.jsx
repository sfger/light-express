import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class Layout extends Component {
  version = "3333";
  constructor( props ) {
    super( props );
  }
  render() {
    let { props, version } = this;
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, minimal-ui" />
          <meta name="screen-orientation" content="portrait" />
          <meta name="full-screen" content="yes" />
          <meta name="browsermode" content="application" />
          <meta name="x5-orientation" content="portrait" />
          <meta name="x5-fullscreen" content="true" />
          <meta name="x5-page-mode" content="app" />
          { ( props.metaList || [] ).map( ( item, i ) => {
            return <link key={ i } { ...item } />;
          } ) }
          <title>{ props.title || "Title" }</title>
          { ( props.cssList || [] ).map( ( item, i ) => {
            item.href += "?" + version;
            item.rel = "stylesheet";
            item.type = "text/css";
            return <link key={ i } { ...item } />;
          } ) }
        </head>
        <body>
          { props.children }
          { ( props.jsList || [] ).map( ( item, i ) => {
            if ( item.id == "requirejs" ) {
              if ( !item[ "data-version" ] ) item[ "data-version" ] = version;
              if ( item[ "data-main" ] ) item[ "data-main" ] += "?" + version;
              if ( !item.src ) item.src = "/public/js/require-min.js" + "?" + version;
            }
            return <script key={ i } { ...item } />;
          } ) }
        </body>
      </html>
    );
  }
}

class IFragment extends Component {
  static propTypes = {
    hidden: PropTypes.bool,
    children: PropTypes.any
  };

  constructor( props ) {
    super( props );
  }

  render() {
    let { hidden, children } = this.props;
    if ( hidden ) return null;
    return <Fragment>{ children }</Fragment>;
  }
}

class Img extends Component {
  constructor( props ) {
    super( props );
  }
  render() {
    let { props } = this;
    let { node, ...attrs } = props;
    if ( !attrs.src ) attrs.src = node.placeholder.white;
    return <img { ...attrs } />;
  }
}

export { Layout, IFragment, Img };
