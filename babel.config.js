module.exports = {
  presets: [
    [ "@babel/preset-env", { loose: true } ],
    [ "@babel/preset-react", { loose: true } ],
    [
      "@babel/preset-typescript",
      { loose: true, isTSX: true, allExtensions: true },
    ],
  ],
  plugins: [
    [ "@babel/plugin-syntax-dynamic-import", { loose: true } ],
    [ "@babel/plugin-transform-async-to-generator", { loose: true } ],
    [ "@babel/plugin-proposal-decorators", { loose: true, legacy: true } ],
    [ "@babel/plugin-proposal-class-properties", { loose: true } ],
    [
      "@babel/plugin-proposal-pipeline-operator",
      { loose: true, proposal: "smart" },
    ],
    [ "@babel/plugin-proposal-private-methods", { loose: true } ],
    [ "@babel/plugin-proposal-do-expressions", { loose: true } ],
    [ "@babel/plugin-proposal-function-bind", { loose: true } ],
    [ "@babel/plugin-transform-runtime", { loose: true, regenerator: true } ],
    [
      "import",
      { loose: true, libraryName: "antd", libraryDirectory: "es", style: true },
      "antd",
    ],
    [
      "module-resolver",
      {
        loose: true,
        root: [ "./" ],
        alias: {
          "^!(.+)": "./components/\\1",
          "^~(.+)": "./src/\\1",
        },
        extensions: [ ".js", ".scss", ".jsx", ".ts", ".tsx" ],
      },
    ],
  ],
};
