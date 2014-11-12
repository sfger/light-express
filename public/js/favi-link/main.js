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
	var leftMenu = $('.left-menu').tree({
		data:data,
		animate:{time:115},
		onClick:function(e){
			var option = this.option;
			if(!leftMenu.isLeaf(this)) return false;
			if(option.url.slice(0, 8)==='https://'){
				var win = window.open(option.url);
				win.opener = null;
			}else{
				mainTab.add({
					title:option.name,
					content:'<iframe src="'+option.url+'" frameborder="0" style="height:100%;width:100%;display:block;"></iframe>',
					closable:true,
					select:true
				});
			}
		},
		onContextmenu:function(e){
			if(e.altKey && leftMenu.isLeaf(this)){
				try{
					var win = window.open(this.option.url);
					win.opener = null;
					return false;
				}catch(e){}
				return false;
			}
		}
	}).tree()[0];
	var mainTab = $('.tab-container').tabs({
		width:1200,
		height:60,
		tabWidth:150,
		contentFit:true,
		border:true,
		position:'north'
	}).tabs()[0];
	mainTab.add({
		title:'主页',
		content:'欢迎来到sfger做客！',
		closable:false,
		select:true
	});
});
