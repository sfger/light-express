// eslint-disable-next-line
var valueParser = function () {
  var parser = {};
  Object.defineProperties(parser, {
    value: {
      get: function () {
        return this._value;
      },
      set: function (o) {
        this._value = o;
      },
    },
    number: {
      get: function () {
        var val = Number(this._value);
        return val || 0;
      },
    },
    string: {
      get: function () {
        var str;
        var type = Object.prototype.toString.call(this._value).slice(8, -1);
        // console.log(type);
        if (!this._value) {
          str = "";
        } else if (this._value instanceof Error) {
          str = "Error";
          var _message = String(this._value.message);
          if (_message) str += ": " + _message;
        } else if (~["Object", "Array"].indexOf(type)) {
          str = JSON.stringify(this._value);
        } else {
          str = String(this._value);
        }
        return str || "";
      },
    },
  });
  return parser;
};
// var a = new valueParser();
// a.value = undefined;
// console.log( a.value );
