// ECMAScript5 shim {{{
Object.keys =
  Object.keys ||
  function (o) {
    if (o !== Object(o)) {
      throw new TypeError("Object.keys called on a non-object");
    }
    var k = [],
      p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        k.push(p);
      }
    }
    return k;
  };
Array.prototype.forEach =
  Array.prototype.forEach ||
  function (fn, scope) {
    for (var i = 0, len = this.length; i < len; ++i) {
      if (i in this) {
        fn.call(scope, this[i], i, this);
      }
    }
  };
Function.prototype.bind =
  Function.prototype.bind ||
  function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError(
        "Function.prototype.bind - what is trying to be bound is not callable"
      );
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(
          this instanceof fNOP && oThis ? this : oThis || window,
          aArgs.concat(Array.prototype.slice.call(arguments))
        );
      };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
Array.prototype.indexOf =
  Array.prototype.indexOf ||
  function (searchElement, fromIndex) {
    var index = -1;
    fromIndex = fromIndex * 1 || 0;
    for (var k = 0, length = this.length; k < length; k++) {
      if (k >= fromIndex && this[k] === searchElement) {
        index = k;
        break;
      }
    }
    return index;
  };
Array.prototype.lastIndexOf =
  Array.prototype.lastIndexOf ||
  function (searchElement, fromIndex) {
    var index = -1,
      length = this.length;
    fromIndex = fromIndex * 1 || length - 1;
    for (var k = length - 1; k > -1; k -= 1) {
      if (k <= fromIndex && this[k] === searchElement) {
        index = k;
        break;
      }
    }
    return index;
  };
Array.prototype.reduce =
  Array.prototype.reduce ||
  function (callback, initialValue) {
    var previous = initialValue,
      k = 0,
      length = this.length;
    if (typeof initialValue === "undefined") {
      previous = this[0];
      k = 1;
    }

    if (typeof callback === "function") {
      for (k; k < length; k++) {
        this.hasOwnProperty(k) &&
          (previous = callback(previous, this[k], k, this));
      }
    }
    return previous;
  };
Array.prototype.reduceRight =
  Array.prototype.reduceRight ||
  function (callback, initialValue) {
    var length = this.length,
      k = length - 1,
      previous = initialValue;
    if (typeof initialValue === "undefined") {
      previous = this[length - 1];
      k--;
    }
    if (typeof callback === "function") {
      for (k; k > -1; k -= 1) {
        this.hasOwnProperty(k) &&
          (previous = callback(previous, this[k], k, this));
      }
    }
    return previous;
  };
Date.now =
  Date.now ||
  function () {
    return new Date().valueOf();
  };
String.prototype.trim =
  String.prototype.trim ||
  function () {
    return this.replace(/^\s+|\s+$/g, "");
  };
Array.prototype.map =
  Array.prototype.map ||
  function (fn, context) {
    var arr = [];
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {
        arr.push(fn.call(context, this[k], k, this));
      }
    }
    return arr;
  };
Array.prototype.filter =
  Array.prototype.filter ||
  function (fn, context) {
    var arr = [];
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {
        fn.call(context, this[k], k, this) && arr.push(this[k]);
      }
    }
    return arr;
  };
Array.prototype.some =
  Array.prototype.some ||
  function (fn, context) {
    var passed = false;
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {
        if (passed === true) break;
        passed = !!fn.call(context, this[k], k, this);
      }
    }
    return passed;
  };
Array.prototype.every =
  Array.prototype.every ||
  function (fn, context) {
    var passed = true;
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {
        if (passed === false) break;
        passed = !!fn.call(context, this[k], k, this);
      }
    }
    return passed;
  };
// }}}

/* vim: set fdm=marker : */
