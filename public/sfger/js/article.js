define(function(require, exports, module){
	var page = {
		create: function(option){
			document.title = 'Article list';
			new EJS({
				text: '<a href="#/article/test">test</a>'
			}).update(option.app.root, {
				data:{}
			});
			option.next();
		},
		destroy: function(){
		}
	};
	module.exports = page;
});
