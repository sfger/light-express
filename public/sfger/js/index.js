require.config({
	baseUrl:'./sfger/js',
	urlArgs:"v=" + document.getElementById("requirejs").getAttribute("data-version"),
	map:{"*":{css:"require-css.js"}},
	paths:{},
	shim:{
	}
});
require([
	'jquery',
	'ejs',
	'ecmaShim'
], function($){
});
