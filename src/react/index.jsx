import React, { Component } from "react";
import { Layout } from "../layout/index.jsx";
class Html extends Component {
  state = {
    title: "React",
    cssList: [ { href: "./css/react.css" } ],
    jsList: [
      { src: "../public/js/es5-shim.js" },
      { src: "../public/js/es5-sham.js" },
      { src: "../public/js/es6-shim.js" },
      { id: "requirejs", "data-main": "./js/context.js", src: "../public/js/require.js" }
    ]
  };
  constructor( props ) {
    super( props );
  }
  render() {
    let { state, props } = this;
    return (
      <Layout { ...props } { ...state }>
        <div id="page" />
      </Layout>
    );
  }
}
export default Html;
