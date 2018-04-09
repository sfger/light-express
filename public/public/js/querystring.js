var queryString = {
	encode : function(value, strict) {
		var ret = encodeURIComponent(value);
		var reg = /[!'()*]/g;
		if(strict) ret = ret.replace(reg, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
		return ret;
	},
	extract : function (str) {
		return str.split('?')[1] || '';
	},
	parse : function (str) {
		// Create an object with no prototype
		// https://github.com/sindresorhus/query-string/issues/47
		var ret = Object.create(null);

		if (typeof str !== 'string') {
			return ret;
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return ret;
		}

		str.split('&').forEach(function (param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (ret[key] === undefined) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}
		});
		return ret;
	},
	stringify : function (obj, opts) {
		opts = opts || {};
		var strict = opts.strict === true;
		var traditional = opts.traditional===false;
		var encode = this.encode;
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];
			if (val === undefined) {
				return '';
			}
			if (val === null) {
				return key;
			}
			if (Array.isArray(val)) {
				var result = [];
				val.slice().sort().forEach(function (val2) {
					if (val2 === undefined) {
						return;
					}
					if (val2 === null) {
						result.push(encode(key, strict));
					} else {
						result.push(encode(key, strict) + encode(traditional&&'[]'||'') + '=' + encode(val2, strict));
					}
				});
				return result.join('&');
			}
			return encode(key, strict) + '=' + encode(val, strict);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	}
};

var s = queryString.stringify({a:1, b:'(2)', c:[1,2,3]}, {traditional:true});

var q = queryString.parse('a=1&b=2&c=3');
