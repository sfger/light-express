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
    "react/jsx-curly-spacing": [ 2, "always" ],
    "react/jsx-no-bind": [ "off" ],
    "react/jsx-uses-vars": [ "error" ],
    "react/jsx-uses-react": [ "error" ],
    "react/prop-types": [ "off" ],
    "no-case-declarations": [ "off" ],
    "no-console": [ "off" ],
    "no-func-assign": [ "off" ],
    "no-empty": [ "off" ],
    "indent": [ "warn", 2, { "SwitchCase": 1 } ],
    "linebreak-style": [ "error", "unix" ],
    "semi": [ "warn", "always" ],
    "react-hooks/rules-of-hooks": "error",
  }
};
