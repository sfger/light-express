module.exports = {
	"plugins": [
		"stylelint-scss"
	],
	"rules": {
		// "scss/dollar-variable-pattern": "^foo",
		// "scss/selector-no-redundant-nesting-selector": true,
		"block-no-empty": true,
		"color-no-invalid-hex": true,
		"comment-empty-line-before": [ "always", {
			"ignore": [ "stylelint-commands", "after-comment" ]
		} ],
		"declaration-colon-space-after": "always",
		"indentation": [ "tab", {
			"except": [ "value" ]
		} ],
		"max-empty-lines": 2,
		"unit-whitelist": [ "em", "rem", "%", "px", "vw", "vh", "rpx", "dpcm", "s", "ms" ]
	}
};
