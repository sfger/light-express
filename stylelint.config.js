module.exports = {
  plugins: [ "stylelint-scss" ],
  rules: {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "comment-empty-line-before": [
      "always",
      { ignore: [ "stylelint-commands", "after-comment" ] },
    ],
    "declaration-colon-space-after": "always",
    indentation: [ 2, { except: [ "value" ] } ],
    "max-empty-lines": 2,
    "unit-whitelist": [
      "em",
      "rem",
      "%",
      "px",
      "vw",
      "vh",
      "rpx",
      "dpcm",
      "s",
      "ms",
      "deg",
    ],
  },
};
