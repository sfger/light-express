import React, { Component } from 'react';
import { WapLayout } from '../layout/index.jsx';
class Html extends Component {
  state = {
    title: 'React',
    cssList: [
      { href: "./css/react.css" }
    ],
    jsList: [
      { src: "../../../../public/js/??es5-shim.js,es5-sham.js?test" },
      { src: "../../../../public/js/es6-shim.js?test" },
      { id: "mainjs", 'data-main': './js/??a.js,context.js', src: '../public/js/require.js' }
    ]
  };
  constructor( props ) {
    super( props );
  }
  render() {
    let { state, props } = this;
    return (
      <WapLayout {...props} {...state} >
        <div id="page"></div>
      </WapLayout>
    );
  }
}
export default Html;
