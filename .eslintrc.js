module.exports = {
    "env"          : {
        "browser"  : true,
        "commonjs" : true,
		"jquery"   : true,
		"amd"      : true,
        "es6"      : true,
        "node"     : true
    },
    "extends": "eslint:recommended",
	"parser": "babel-eslint",
    "parserOptions": {
		"ecmaVersion": 8, // or 7
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
			"jsx": true
        },
        "sourceType": "module"
    },
    "plugins" : [ "react" ],
	"globals" : {
		"window"                  : true,
		"EJS"                     : true,
		"undefined"               : true,
		"light"                   : true,
		"__non_webpack_require__" : true,
		"__version__"             : true
	},
    "rules": {
		"no-console"      : ["off"],
		"no-empty"        : ["off"],
        "indent"          : ["warn", "tab", {"SwitchCase":1}],
        "linebreak-style" : ["error", "unix"],
        "semi"            : ["warn", "always"]
    }
};
