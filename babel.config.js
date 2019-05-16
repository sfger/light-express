/* eslint array-bracket-newline: [ "error", { multiline: true, minItems: 3 } ] */
/* eslint array-element-newline: [ "error", { multiline: true, minItems: 3 } ] */
module.exports = {
  presets: [
    [ "@babel/preset-env", { loose: true } ],
    [ "@babel/preset-react", { loose: true } ],
    [ "@babel/preset-typescript", { loose: true, isTSX: true, allExtensions: true } ]
  ],
  plugins: [
    [ "@babel/plugin-syntax-dynamic-import", { loose: true } ],
    [ "@babel/plugin-transform-async-to-generator", { loose: true } ],
    [ "@babel/plugin-proposal-decorators", { loose: true, legacy: true } ],
    [ "@babel/plugin-proposal-class-properties", { loose: true } ],
    [ "@babel/plugin-proposal-pipeline-operator", { proposal: "smart" } ],
    [ "@babel/plugin-transform-runtime", { loose: true, regenerator: true } ],
    [
      "import",
      { loose: true, libraryName: "antd", libraryDirectory: "es", style: true },
      "antd"
    ],
    [
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
    ]
  ]
};
