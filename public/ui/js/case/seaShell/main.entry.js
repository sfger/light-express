__non_webpack_require__.config({
	baseUrl: '../../../js/',
	urlArgs: document.getElementById("requirejs").getAttribute("data-version"),
	map: {"*":{css:"require-css"}},
	paths: {
		'jquery': '../../public/js/jquery',
		'es5-shim': '../../public/js/es5-shim'
	},
	shim: {
		// 'jquery-layout':{deps:["jquery", "es5-shim"]},
		// 'jquery-tree':  {deps:["jquery", "es5-shim"]},
		// 'jquery-tabs':  {deps:["jquery", "es5-shim"]}
	}
});
__non_webpack_require__([
	'jquery',
	'es5-shim'
	// 'jquery-layout',
	// 'jquery-tree',
	// 'jquery-tabs'
], function($){
	// require('../../../../public/js/es5-shim');
	require('../../jquery-layout');
	require('../../jquery-tree');
	require('../../jquery-tabs');
	let $leftMenu = $('.left-menu');
	let $mainTab = $('.tab-ctn');
	let $page = $('#page');
	$page.layout({
		panel:{
			toggle:true,
			resize:true,
			each:{
				north:{toggle:false, resize:false},
				south:{toggle:false, resize:false},
				west: {toggle:true,  resize:true },
				east: {toggle:false, resize:false}
			}
		},
		panelBar:{
			size: 1,
			each: {west:{width:4}}
		}
	}).show();
	let data = require('./data');
	$leftMenu.tree({
		data:data,
		animate:{time:115},
		onClick:function(){
			let option = this.option;
			if(!$leftMenu.tree('isLeaf', this)){
				return false;
			}
			if(option.url.slice(0, 8)==='https://' || option.target=="_blank"){
				let win = window.open(option.url);
				win.opener = null;
			}else{
				$mainTab.tabs('add', {
					title:option.name,
					content:'<iframe src="'+option.url+'" frameborder="0" style="height:100%;width:100%;display:block;"></iframe>',
					closable:true,
					select:true
				});
			}
		},
		onContextmenu:function(e){
			if(e.altKey && $leftMenu.tree('isLeaf', this)){
				try{
					let win = window.open(this.option.url);
					win.opener = null;
				}catch(e){}
				return false;
			}
		}
	});
	$mainTab.tabs({
		width      : 1200,
		height     : 60,
		tabWidth   : 150,
		contentFit : true,
		border     : true,
		position   : 'north'
	});
	let default_tab = `<div class="imgc" style="height:100%;">
		<div class="imge">欢迎来朴水做客！</div>
		<!--[if lt IE 8]><p class="iecp"></p><![endif]-->
	</div>`;
	$mainTab.tabs('add', {
		title    : '主页',
		content  : default_tab,
		closable : true,
		select   : true
	});
});
