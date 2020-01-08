const path = require( "path" );
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    jquery: true,
    amd: true,
    es6: true,
    node: true
  },
  extends: [ "eslint:recommended", "plugin:react/recommended", "prettier" ],
  // parser: "babel-eslint",
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true
    },
    sourceType: "module",
    babelOptions: {
      cwd: path.resolve( __dirname ),
      configFile: "./babel.config.js"
    }
  },
  settings: {
    react: {
      createClass: "createReactClass",
      pragma: "React",
      version: "detect"
    }
  },
  // plugins: [ "react", "react-hooks", "babel", "markdown" ],
  plugins: [ "typescript", "react", "react-hooks", "babel", "markdown" ],
  globals: {
    window: true,
    test: true,
    expect: true,
    Vue: true,
    EJS: true,
    undefined: true,
    light: true,
    __non_webpack_require__: true,
    __version__: true
  },
  rules: {
    "linebreak-style": [ "error", "unix" ],
    semi: [ "warn", "always" ],
    "brace-style": [ 2, "1tbs", { allowSingleLine: true } ],
    "accessor-pairs": 2,
    "constructor-super": 2,
    "object-curly-spacing": [ "error", "always" ],
    "no-this-before-super": 2,
    "no-trailing-spaces": "error",
    "react/jsx-curly-spacing": [ 2, { when: "always", children: true } ],
    "react/jsx-no-bind": [ "off" ],
    "react/jsx-uses-vars": [ "error" ],
    "react/jsx-uses-react": [ "error" ],
    "react/prop-types": [ "off" ],
    "react-hooks/rules-of-hooks": "error",
    "react/jsx-max-props-per-line": [ 2, { maximum: 1000000, when: "always" } ],
    "react/jsx-one-expression-per-line": [ 0, "never" ],
    "react/jsx-child-element-spacing": [ 0, "never" ],
    "react/jsx-no-target-blank": [ 0 ],
    // "array-bracket-newline": [ "error", { multiline: true, minItems: 2 } ],
    // "array-element-newline": [ "error", { multiline: true, minItems: 2 } ],
    "array-bracket-spacing": [ "error", "always" ],
    "computed-property-spacing": [ "error", "always" ],
    "newline-per-chained-call": [ "error", { ignoreChainWithDepth: 5 } ],
    "template-curly-spacing": [ 2, "always" ],
    "no-case-declarations": [ "off" ],
    "no-console": [ "off" ],
    "no-func-assign": [ "off" ],
    "no-empty": [ "off" ],
    quotes: [ 0, "double", { avoidEscape: true } ],
    "jsx-quotes": [ "error", "prefer-double" ],
    indent: [ "warn", 2, { SwitchCase: 1, ignoredNodes: [ "TemplateLiteral" ] } ],
    radix: 2,
    "semi-spacing": [ 2, { before: false, after: true } ],
    "arrow-spacing": [ 2, { before: true, after: true } ],
    "comma-spacing": [ 2, { before: false, after: true } ],
    "comma-style": [
      "error",
      "last",
      { exceptions: { ArrayExpression: true, ObjectExpression: true } }
    ],
    "comma-dangle": [ 0, "always" ],
    // "comma-dangle": [
    //   "error",
    //   {
    //     arrays: "always-multiline",
    //     objects: "always-multiline",
    //     imports: "always-multiline",
    //     exports: "always-multiline",
    //     functions: "never",
    //   },
    // ],
    "block-spacing": [ 2, "always" ],
    "key-spacing": [ 2, { beforeColon: false, afterColon: true } ],
    "space-before-blocks": [ 2, "always" ],
    "space-before-function-paren": [ 0, "never" ],
    "space-in-parens": [ 2, "always" ],
    "space-infix-ops": 2,
    "space-unary-ops": [ 2, { words: true, nonwords: false } ],
    "spaced-comment": [
      2,
      "always",
      {
        markers: [
          "global",
          "globals",
          "eslint",
          "eslint-disable",
          "*package",
          "!",
          ","
        ]
      }
    ],
    "use-isnan": 2
  }
};
