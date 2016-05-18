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
    "plugins" : [ "react" ],
	"globals" : {
		"window"                  : true,
		"jQuery"                  : true,
		"$"                       : true,
		"require"                 : true,
		"define"                  : true,
		"EJS"                     : true,
		"undefined"               : true,
		"light"                   : true,
		"__non_webpack_require__" : true,
		"__version__"             : true
	},
    "rules": {
		"no-console"      : [ "off" ],
        "indent"          : [ "warn", "tab", {"SwitchCase":1} ],
        "linebreak-style" : [ "error", "unix" ],
        "semi"            : [ "warn", "always" ]
    }
};
