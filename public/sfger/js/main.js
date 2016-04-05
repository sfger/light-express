window.__version__ = document.getElementById("requirejs").getAttribute("data-version");
require.config({
	baseUrl : './',
	urlArgs : "v=" + __version__,
	map     : {"*":{css:"public/require-css.js"}},
	paths   : {
		'jquery':'public/jquery'
	},
	shim    : {}
});
require([
	'jquery',
	'public/router',
	'public/fetch',
	'public/es5-shim',
	'public/es6-shim',
	'public/web-animations',
	'public/ejs'
], function($, director){
	var Router = director.Router;
	var app = {
		root: document.getElementById('page'),
		init_router: function(){
			var app = this;
			app.router = Router({
				'/404':{
					on: function(next){
						document.title = '404 Not Found';
						new EJS({
							text:'<div class="imgc" style="height:100%;"><div class="imge">您网页不存在，<a href="#/index">返回首页</a></div></div>'
						}).update(app.root, {
							data:{}
						});
						next();
					}
				}
			}).configure({
				async    : true,
				recurse  : 'forward',
				notfound : function(){
					// app.router.setRoute('404');
					app.router.dispatch('on','/404');
				}
			});
		},
		define_router_param: function(){
			router = this.router;
			router.param('id', /([\d]+)/);
			router.param('index', /([\w]+)/);
		},
		global_router: function(){
			router = this.router;
			router.on('on', '/?(.*)', function(path, next){
				require(['sfger/js/'+(path||'index')], function(page){
					app.root.innerHTML = '';
					page.create({
						router : router,
						path   : path,
						next   : next,
						app    : app
					});
				}, function(err){
					router.dispatch('on', '/404');
				});
			});
		},
		config_router: function(){
			var base_css = document.getElementById('css-base');
			router.on('after', '/article/:index', function(){
				base_css.removeAttribute('disabled');
				arguments[arguments.length-1]();
			});
			router.on('on', '/article/:index', function(article_index, next){
				base_css.setAttribute('disabled', true);
				require.config({
					shim: {
						'public/highlight':{exports:'hljs'}
					}
				});
				require([
					'jquery',
					'public/markdown-it',
					'public/highlight',
					'sfger/tpl/article/'+article_index+'.markdown',
					'css!sfger/css/case/snap.css',
					'css!sfger/css/highlight.css'
				], function($, markdown, hljs, article){
					var md = new markdown().set({html:true, breaks:true});
					article = md.render(article[article_index+'.markdown']);
					new EJS({
						text: '<div><a href="#/index">首页</a> <a href="<%- home %>/index.html#/article/markdown">本文链接</a></div><div class="md-ctn"><%=data%></div><div><a href="#/index">首页</a> <a href="<%- home %>/index.html#/article/markdown">本文链接</a></div>'
					}).update(app.root, {
						data: article,
						home: 'http://'+location.host + '/index.html'
					});
					$('pre code').each(function(i, block) {
						hljs.highlightBlock(block);
					});
					next();
				});
			});
		},
		boot: function(){
			this.init_router();
			this.define_router_param();
			this.config_router();
			this.global_router();
			this.router.init('index');
		}
	};
	app.boot();
});
