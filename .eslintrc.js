module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "installedESLint": true,
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    // "plugins": [ "react" ],
    "rules": {
		"no-console"      : [ "off" ],
        "indent"          : [ "warn", "tab" ],
        "linebreak-style" : [ "error", "unix" ],
        "semi"            : [ "warn", "always" ]
    }
};
