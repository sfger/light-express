/* eslint array-bracket-newline: [ "error", { multiline: true, minItems: 5 } ] */
/* eslint array-element-newline: [ "error", { multiline: true, minItems: 5 } ] */
let moduleResolver = [
  "module-resolver",
  {
    root: [ "./" ],
    alias: {
      "^!(.+)": "./components/\\1",
      "^~(.+)": "./src/\\1"
    },
    extensions: [
      ".js",
      ".scss",
      ".jsx",
      ".ts",
      ".tsx"
    ]
  }
];
module.exports = {
  presets: [ [ "@babel/preset-env", { loose: true } ], [ "@babel/preset-react", { loose: true } ] ],
  plugins: [
    [ "@babel/plugin-syntax-dynamic-import", { loose: true } ],
    [ "@babel/plugin-transform-async-to-generator", { loose: true } ],
    [ "@babel/plugin-proposal-decorators", { loose: true, legacy: true } ],
    [ "@babel/plugin-proposal-class-properties", { loose: true } ],
    [ "@babel/plugin-transform-runtime", { loose: true, regenerator: true } ],
    [ "@babel/plugin-transform-flow-strip-types", { loose: true } ],
    [ "import", { loose: true, libraryName: "antd", libraryDirectory: "es", style: true }, "antd" ],
    moduleResolver
  ]
};
