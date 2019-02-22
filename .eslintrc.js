module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "jquery": true,
    "amd": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8, // or 7
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    },
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      "pragma": "React", // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      "flowVersion": "0.53" // Flow version
    }
  },
  "plugins": [
    'react',
    'react-hooks',
    'babel',
    'markdown',
  ],
  "globals": {
    "window": true,
    "Vue": true,
    "EJS": true,
    "undefined": true,
    "light": true,
    "__non_webpack_require__": true,
    "__version__": true
  },
  "rules": {
    "linebreak-style": [ "error", "unix" ],
    "brace-style": [ 2, "1tbs", { "allowSingleLine": true } ],
    "semi": [ "warn", "always" ],
    "accessor-pairs": 2,
    "constructor-super": 2,
    "no-this-before-super": 2,
    "react/jsx-curly-spacing": [ 2, "always" ],
    "react/jsx-no-bind": [ "off" ],
    "react/jsx-uses-vars": [ "error" ],
    "react/jsx-uses-react": [ "error" ],
    "react/prop-types": [ "off" ],
    "react-hooks/rules-of-hooks": "error",
    "no-case-declarations": [ "off" ],
    "no-console": [ "off" ],
    "no-func-assign": [ "off" ],
    "no-empty": [ "off" ],
    "indent": [ "warn", 2, { "SwitchCase": 1 } ],
    "radix": 2,
    "semi-spacing": [ 2, { "before": false, "after": true } ],
    "arrow-spacing": [ 2, { "before": true, "after": true } ],
    "comma-spacing": [ 2, { "before": false, "after": true } ],
    "block-spacing": [ 2, "always" ],
    "key-spacing": [ 2, { "beforeColon": false, "afterColon": true } ],
    "space-before-blocks": [ 2, "always" ],
    "space-before-function-paren": [ 2, "never" ],
    "space-in-parens": [ 2, "always" ],
    "space-infix-ops": 2,
    "space-unary-ops": [ 2, { "words": true, "nonwords": false } ],
    "spaced-comment": [ 2, "always", { "markers": [ "global", "globals", "eslint", "eslint-disable", "*package", "!", "," ] } ],
    "use-isnan": 2,
  }
};
