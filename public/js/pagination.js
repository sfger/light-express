(function(window){
    var pagination = function(options){
		options = light.util.extend({
			useAjax:false,
			dataSize:0,
			pageSize:25,
			pageNumber:null,
			pageNumberQueryName:'pageNumber',
			pageSizeList:[10, 25, 50, 100]
		}, options);
		var pagination = (function(){
			var pagination = function(options){ return new pagination.prototype.init(options); }
			pagination.prototype = {
				render:null,pageCount:1,
				init:function(options){
					this.userOptions = options;
					var render = options.render;
					render.innerHTML = '';
					this.pageCount = Math.ceil(options.dataSize/options.pageSize);
					this.pageCount = this.pageCount<1 ? 1 : this.pageCount;
					if(!/(^|\s)pagination-container(\s|$)/.test(render.className)){
						render.className += (render.className ? ' ' : '') + 'pagination-container';
					}
					var pageNumber, url;
					pageNumber = options.pageNumber;
					if(options.useAjax){
						url = 'javascript:;';
					}else{
						this.pageNumberRegExp = new RegExp('([?&]{1}'+options.pageNumberQueryName+'=)([^&]*)');
						pageNumber = this.pageNumberRegExp.exec(location.href);
						if(pageNumber && pageNumber[2]) pageNumber = pageNumber[2];
						if(!pageNumber){
							if(location.search) url = location.href+'&'+options.pageNumberQueryName+'=';
							else url = location.href+'?'+options.pageNumberQueryName+'=';
							pageNumber = 1;
						}else{
							url = location.href.replace(this.pageNumberRegExp,"$1"+'');
							pageNumber = parseInt(pageNumber);
							if(isNaN(pageNumber)) pageNumber=1;
						}
					}
					pageNumber = pageNumber>this.pageCount ? this.pageCount : pageNumber;
					options.pageNumber = pageNumber;
					this.navishow(pageNumber,this.pageCount,url,5);
					render.innerHTML += '&nbsp;<div class="form">第<form action="" method="get"><input name="'+options.pageNumberQueryName+'" class="page" type="text" value="" /></form><a href="javascript:;" class="goto">页</a></div>&nbsp;<div class="desc">共<span class="dataSize">'+options.dataSize+'</span>条数据</div>';
					this.initEvent();
				},
				initEvent:function(){
					var that = this;
					var options = this.userOptions;
					var render = options.render;
					render.children[1].children[0].onsubmit=function(){
						var a = getElementsByClassName("page",render)[0].value;
						if(a>that.pageCount) getElementsByClassName("page",render)[0].value=that.pageCount;
						else if(a<1) getElementsByClassName("page",render)[0].value=1;
						if(isNaN(a)) a = 1;
						if(options.useAjax){
							options.pageNumber = Number(a);
							if(options.onChangePage)
								options.onChangePage.call(that, options.pageNumber, that.pageCount);
							window.pagination(options);
							return false;
						}
					};
					render.children[1].children[1].onclick=function(e){
						e = e || window.event;
						var a = getElementsByClassName("page",render)[0].value;
						a = (a>that.pageCount)?that.pageCount:(a<1)?1:a;
						if(isNaN(a)) a = 1;
						if(options.useAjax){
							options.pageNumber = Number(a);
							if(options.onChangePage)
								options.onChangePage.call(that, options.pageNumber, that.pageCount);
							window.pagination(options);
						}else{
							location.href = location.href.replace(that.pageNumberRegExp,"$1"+a);
						}
						e.stopPropagation();
					};
					if(options.useAjax)
						render.onclick = function(e){
							e = e || window.event;
							var target = e.target || e.srcElement;
							if(/(^|\s)pn(\s|$)/.test(target.className)){
								options.pageNumber = Number(target.getAttribute('pageNumber'));
								if(options.onChangePage)
									options.onChangePage.call(that, options.pageNumber, that.pageCount);
								window.pagination(options);
							}
						};
				},
				getNaviNode:function(url,page,show){
					if(!this.userOptions.useAjax){
						url = url.replace(this.pageNumberRegExp, "$1"+page);
					}
					var c = (function(){
						if(show==='上一页') return ' prev';
						else if(show==='下一页') return ' next';
						else return '';
					})();
					url='<a href="'+url+'" pageNumber="'+page+'" class="pn'+c+'">'+show+'</a>';
					this.userOptions.render.children[0].innerHTML += url;
				},
				appendPlainChild:function(text){
					this.userOptions.render.children[0].innerHTML += '<a href="javascript:;" class="'+(text==='...' ? 'plain' : 'current')+'">'+text+'</span>';
				},
				navishow:function(cur,page,url,show){
					show = show==undefined ? 11 : show;
					var hf = Math.floor(show/2);
					var i = 0;
					this.userOptions.render.innerHTML = '<div class="pc"></div>';
					if(cur>1) this.getNaviNode(url,cur-1,"上一页");
					if(page<=show){
						for(i=1;i<=page;i++)
							if(i==cur) this.appendPlainChild(i);
							else this.getNaviNode(url,i,i);
					}else{
						if( (cur-2)<(hf+2) ){
							for(i=1;i<=cur;i++)
								if(i==cur) this.appendPlainChild(i);
								else this.getNaviNode(url,i,i);
						}else{
							this.getNaviNode(url,1,1);
							if(page!=show+1) this.appendPlainChild('...');
							for(i=cur-hf+((page-cur-hf>0)?0:(page-cur-hf));i<=cur;i++)
								if(i==cur) this.appendPlainChild(i);
								else this.getNaviNode(url,i,i);
						}
						if(page-cur<hf+3){
							for(i=cur+1;i<=page;i++)
								if(i==cur) this.appendPlainChild(i);
								else this.getNaviNode(url,i,i);
						}else{
							cur = parseInt(cur);
							for(i=cur+1;i<=(cur+hf-((cur-hf>1)?0:(cur-hf-1)));i++)
								if(i==cur) this.appendPlainChild(i);
								else this.getNaviNode(url,i,i);
							if(page!=show+1) this.appendPlainChild('...');
							this.getNaviNode(url,page,page);
						}
					}
					if(cur!=page) this.getNaviNode(url,cur+1,"下一页");
				}
			}
			pagination.prototype.init.prototype = pagination.prototype;
			return pagination;
		})();
		for(var i=0; i<options.renders.length; i++){
			//options.render = options.renders[i];
			options.renders[i].ui = {
				iPagination:pagination(light.util.extend(true, {render:options.renders[i]}, options))
			};
		}
    };
    return window.pagination = pagination;
})(window);
/* vim: set fdm=marker */
