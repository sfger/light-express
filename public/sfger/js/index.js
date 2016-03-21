define(function(require, exports, module){
	var page = {
		create: function(option){
			document.title = 'Share From Water';
			require(['sfger/tpl/index.tpl'], function(data){
				new EJS({
					text: data['index.tpl']
				}).update(option.app.root, {
					data:{}
				});
				option.next();
			});
		},
		destroy: function(){
		}
	};
	module.exports = page;
});
