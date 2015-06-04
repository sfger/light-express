$(function(){
	"use strict";
	$('#page').layout({
		panel: {
			toggle:true,
			resize:true,
			each:{
				north:{toggle:false, resize:false},
				south:{toggle:false, resize:false},
				west:{toggle:true, resize:true },
				east:{toggle:false, resize:false }
			}
		},
		panelBar:{
			size: 1,
			each:{west:{width:4}}
		}
	});
	$('#page').show();
	var leftMenu = $('.left-menu');
	leftMenu.tree({
		data:data,
		animate:{time:115},
		onClick:function(e){
			var option = this.option;
			if(!leftMenu.tree('isLeaf', this, 'test')){
				return false;
			}
			if(option.url.slice(0, 8)==='https://'){
				var win = window.open(option.url);
				win.opener = null;
			}else{
				mainTab.tabs('add', {
					title:option.name,
					content:'<iframe src="'+option.url+'" frameborder="0" style="height:100%;width:100%;display:block;"></iframe>',
					closable:true,
					select:true
				});
			}
		},
		onContextmenu:function(e){
			if(e.altKey && leftMenu.tree('isLeaf', this)){
				try{
					var win = window.open(this.option.url);
					win.opener = null;
					return false;
				}catch(e){}
				return false;
			}
		}
	});
	var mainTab = $('.tab-container')
	mainTab.tabs({
		width:1200,
		height:60,
		tabWidth:150,
		contentFit:true,
		border:true,
		position:'north'
	});
	mainTab.tabs('add', {
		title:'主页',
		content:'欢迎来到sfger做客！',
		closable:false,
		select:true
	});
});