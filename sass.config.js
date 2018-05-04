var path = require('path');
var root = path.resolve(__dirname);
module.exports = {
	alias        : {
		'@' : '/components/',
		'~' : '/src/'
	},
	includePaths : [root+'/node_modules/'],
	importer     : function(url, prev){
		var leading = url.charAt(0);
		var map     = this.options.alias;
		if(leading in map){
			url = path.normalize(root + map[leading] + url.slice(1));
			url = path.relative(path.dirname(prev), url);
		}
		return {file:url};
	},
	indentWidth  : 1,
	linefeed     : 'lf',
	indentType   : 'tab',
	outputStyle  : 'compact'
};
