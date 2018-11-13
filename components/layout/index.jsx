import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';

class WapLayout extends Component {
  version = '3333';
  constructor( props ) {
    super( props );
  }
  render() {
    let { props, version } = this;
    return <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, minimal-ui" />
        <meta name="screen-orientation" content="portrait" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />
        <meta name="x5-orientation" content="portrait" />
        <meta name="x5-fullscreen" content="true" />
        <meta name="x5-page-mode" content="app" />
        {
          (props.metaList||[]).map( (item, i) => {
            return <link key={ i } { ...item } />;
          } )
        }
        <title>{props.title||'Title'}</title>
        {
          (props.cssList||[]).map( (item, i) => {
            item.href += '?' + version;
            item.rel = "stylesheet";
            item.type = "text/css";
            return <link key={ i } { ...item } />;
          } )
        }
      </head>
      <body>
        {props.children}
        {
          (props.jsList||[]).map( (item, i) => {
            item['data-main'] += '?' + version;
            if( item.id=='requirejs' ) {
              if( !item['data-version'] ) item['data-version'] = version;
              if( !item.src ) item.src = "/public/js/require-min.js" + '?' + version;
            }
            return <script key={ i } { ...item }></script>;
          } )
        }
      </body>
    </html>;
  }
}

class WapHeader extends Component {
  state = {
    list: [
      { title: '首页', link: '', img: '//cdn01.1haitao.com/wap-order/img/icon-header-home.png' },
      { title: '购物车', link: '', img: '//cdn01.1haitao.com/wap-order/img/icon-header-cart.png' },
      { title: '我的', link: '', img: '//cdn01.1haitao.com/wap-order/img/icon-header-my.png' },
    ],
  };
  constructor( props ) {
    super( props );
  }
  render() {
    let { state, props } = this;
    let { menu = true, title = "海淘1号" } = props;
    return (
      <section className="header">
        <div className="action-left arrow-left back"></div>
        <div className="page-title">{title}</div>
        {
          menu ? (
            <Fragment>
              <a href="javascript:" className="action-right">
                <img src="//cdn01.1haitao.com/wap-order/img/icon-more.png" alt="" />
              </a>
              <div className="menu">
                {
                  state.list.map( (item, i) => {
                    return (
                      <a key={ i } href={ item.link }>
                        <div className="img">
                          <img src={ item.img } alt="" />
                        </div>
                        <div>{ item.title }</div>
                      </a>
                    );
                  } )
                }
              </div>
            </Fragment>
          ) : (
            <a href="javascript:" className="action-right"/>
          )
        }
      </section>
    );
  }
}

class WapFooter extends Component {
  state = {
    list: [
      { className: 'home', title: '首页', link: '' },
      { className: 'recommend', title: '值得买', link: '' },
      { className: 'site', title: '全球电商', link: '' },
      { className: 'me', title: '我的', link: '' },
    ],
  };
  constructor( props ) {
    super( props );
  }
  render() {
    let { props, state } = this;
    return (
      <section className="footer">
        {
          state.list.map( (item, i) => {
            let linkClass = 'nav-img';
            if( item.title == props.title ) linkClass += ' active';
            return (
              <a key={ i } href="" className={ linkClass }>
                <em className={ item.className }></em>
                <p>{ item.title }</p>
              </a>
            );
          } )
        }
      </section>
    );
  }
}

class IFragment extends Component {
  static propTypes = {
    hidden: PropTypes.bool,
    children: PropTypes.any,
  };

  constructor( props ) {
    super( props );
  }

  render() {
    let { hidden, children } = this.props;
    if ( hidden ) return null;
    return (
      <React.Fragment>{children}</React.Fragment>
    );
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
    return (
      <img { ...attrs } />
    );
  }
}

export {
  WapLayout,
  WapHeader,
  WapFooter,
  IFragment,
  Img,
};
