var path = require('path');
var root = path.resolve(__dirname);
console.log(root);
module.exports = {
	alias        : {
		'@' : '/components/',
		'~' : '/public/'
	},
	includePaths : [root+'/node_modules/'],
	importer     : function(url, prev){
		let leading = url.charAt(0);
		let map     = this.options.alias;
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
