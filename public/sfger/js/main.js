window.__version__ = document.getElementById("requirejs").getAttribute("data-version");
require.config({
	baseUrl : './',
	urlArgs : __version__,
	map     : {"*":{css:"public/require-css.js"}},
	paths   : {
		jquery:'public/jquery'
	},
	shim    : {
		jquery:['public/es5-shim', 'public/es6-shim']
	}
});
require([
	'jquery',
	'public/router',
	// 'public/fetch',
	// 'public/web-animations',
	'public/ejs'
], function($, director){
	var Router = director.Router;
	var app = {
		root: document.getElementById('page'),
		boot: function(){
			this.init_router();
			this.define_router_param();
			this.config_router();
			this.global_router();
			this.router.init('index');
		},
		fullScreen: function(next){
			$('html').addClass('full-screen');
			next&&next();
		},
		exitFullScreen: function(next){
			$('html').removeClass('full-screen');
			next&&next();
		},
		init_router: function(){
			var app = this;
			app.router = Router({
				'/404':{
					before: app.fullScreen,
					after: app.exitFullScreen,
					on: function(next){
						document.title = '404 Not Found';
						new EJS({
							text:'<div class="imgc" style="height:100%;"><div class="imge">您访问的网页不存在，<a href="#/index">返回首页</a></div></div>'
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
				if(app.page) app.page.destroy();
				new Promise(function(resolve, reject){
					var module = 'sfger/js/' + (path||'index');
					require([module], resolve, function(err){
						return reject(404);
					});
				}).then(function(page){
					if(!page) return Promise.reject(404);
					$(app.root).empty();
					page.option = {
						router : router,
						path   : path,
						next   : next,
						app    : app
					};
					page.create();
					app.page = page;
				})['catch'](function(err){
					router.dispatch('on', '/404');
				});
			});
		},
		config_router: function(){
			router.on('on', '/article/:index', function(article_index, next){
				// var base_css = document.getElementById('css-base');
				// base_css.removeAttribute('disabled');
				// base_css.setAttribute('disabled', true);
				require.config({
					shim: {
						'public/highlight':{exports:'hljs'}
					}
				});
				require([
					'jquery',
					'public/markdown-it',
					'public/highlight',
					'sfger/tpl/article/'+article_index+'.markdown'
				], function($, markdown, hljs, article){
					var md = new markdown().set({html:true, breaks:true});
					article = md.render(article[article_index+'.markdown']);
					new EJS({
						text: '<div class="article-page"><div class="article-bar article-header"><a href="#/index">首页</a> <a href="<%- home %>/index.html#/article/markdown">本文链接</a></div><div class="markdown-body md-ctn"><%=data%></div><div class="article-bar article-footer"><a href="#/index">首页</a> <a href="<%- home %>/index.html#/article/markdown">本文链接</a></div></div>'
					}).update(app.root, {
						data: article,
						home: '#/index'
					});
					$('pre code').each(function(i, block) {
						hljs.highlightBlock(block);
					});
					next();
				});
			});
		}
	};
	app.boot();
});
