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
    "plugin:react/recommended",
    "prettier",
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    },
    "sourceType": "module"
  },
  "settings": {
    "react": {
      "createClass": "createReactClass",
      "pragma": "React",
      "version": "detect",
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
    "react/jsx-curly-spacing": [ 2, { "when": "always", "children": true } ],
    "react/jsx-child-element-spacing": [ 2, {} ],
    "react/jsx-no-bind": [ "off" ],
    "react/jsx-uses-vars": [ "error" ],
    "react/jsx-uses-react": [ "error" ],
    "react/prop-types": [ "off" ],
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-max-props-per-line": [ 2, { "maximum": 1000000, "when": "always" } ],
    "react/jsx-one-expression-per-line": [ 0, "never" ],
    // "template-curly-spacing": [ 2, "always" ],
    "no-case-declarations": [ "off" ],
    "no-console": [ "off" ],
    "no-func-assign": [ "off" ],
    "no-empty": [ "off" ],
    "quotes": [ 0, "double", { "avoidEscape": true } ],
    "jsx-quotes": [ "error", "prefer-double" ],
    "indent": [ "warn", 2, {
      "SwitchCase": 1,
      "ignoredNodes": [ "TemplateLiteral" ],
    } ],
    "radix": 2,
    "semi-spacing": [ 2, { "before": false, "after": true } ],
    "arrow-spacing": [ 2, { "before": true, "after": true } ],
    "comma-spacing": [ 2, { "before": false, "after": true } ],
    "block-spacing": [ 2, "always" ],
    "key-spacing": [ 2, { "beforeColon": false, "afterColon": true } ],
    "space-before-blocks": [ 2, "always" ],
    "space-before-function-paren": [ 0, "never" ],
    "space-in-parens": [ 2, "always" ],
    "space-infix-ops": 2,
    "space-unary-ops": [ 2, { "words": true, "nonwords": false } ],
    "spaced-comment": [ 2, "always", { "markers": [ "global", "globals", "eslint", "eslint-disable", "*package", "!", "," ] } ],
    "use-isnan": 2,
  }
};
