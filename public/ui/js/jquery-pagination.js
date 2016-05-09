$.fn.pagination = function(options){
	var type = $.type(options);
	if(type==='string'){
		var args = Array.prototype.slice.call(arguments).slice(1);
		this.each(function(){
			var ui = $(this).data('ui');
			if(ui&&ui.iPagination){
				ui.iPagination[options].apply(ui.iPagination, args);
			}else{
				throw new Error('UI:window does not init...');
			}
		});
		return true;
	}
	options = $.extend(true, {
		useAjax             : false,            // 是否使用ajax方式请求数据，否则生成页面跳转链接
		dataSize            : 0,                // 数据条数
		show                : 5,                // 当前页一边显示的页面
		pageSize            : 25,               // 每页数据数
		pageNumber          : null,             // 页码
		pageNumberQueryName : 'pageNumber',     // 页码参数名
		showPreNext         : true,             // 是否页面下面一页按钮
		showPreNextOnEdge   : true,             // 最后一页是否显示不能点击的下一页
		prePageAlias        : '上一页',         // 上一页文字
		nextPageAlias       : '下一页',         // 下一页文字
		pageSizeList        : [10, 25, 50, 100] // 保留功能，选择每页数据数
	}, options);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	handler.prototype = {
		render: null,
		pageCount: 1,
		init: function(box, options){
			this.userOptions = options;
			var render = options.render;
			this.pageCount = Math.ceil(options.dataSize/options.pageSize);
			this.pageCount = this.pageCount<1 ? 1 : this.pageCount;
			// if(!/(^|\s)pagination-ctn(\s|$)/.test(render.className)){
			// 	render.className += (render.className ? ' ' : '') + 'pagination-ctn';
			// }
			$(render).addClass('pagination-ctn');
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
					pageNumber = parseInt(pageNumber, 10);
					if(isNaN(pageNumber)) pageNumber=1;
				}
			}
			pageNumber = pageNumber>this.pageCount ? this.pageCount : pageNumber;
			options.pageNumber = pageNumber;
			this.url = url;
			this.update(pageNumber, options.dataSize);
			this.initEvent();
		},
		update: function(pageNumber, dataSize){
			var options = this.userOptions;
			if(!isNaN(dataSize) && Number(dataSize)>=0){
				options.dataSize = dataSize;
				this.pageCount = Math.ceil(options.dataSize/options.pageSize) || 1;
			}
			// console.log(pageNumber,dataSize);
			$(options.render).html( this.navishow(pageNumber,this.pageCount,this.url,options.show) + '&nbsp;<div class="form"><span>第</span><input name="'+options.pageNumberQueryName+'" class="page" type="text" value="" /><a href="javascript:;" class="go">GO</a><span>页</span></div>&nbsp;<div class="desc">共<span class="dataSize">'+options.dataSize+'</span>条记录</div>' );
		},
		initEvent: function(){
			var that = this;
			var options = this.userOptions;
			var render = options.render;
			$(render).on({
				'keyup': function(e){
					if(-1!=$.inArray(e.keyCode, [8,37,39])){
						return true;
					}
					var n = parseInt(this.value, 10) || 1;
					if(n>1 && e.keyCode===40){
						--n;
					}
					if(n<that.pageCount && 38===e.keyCode){
						++n;
					}
					if(n<1) n = 1;
					if(n>that.pageCount) n = that.pageCount;
					this.value = n;
					return false;
				}
			}, '.page');
			$(render).on('click', '.go', function(){
				var a = $(".page",render).val();
				if(!a || isNaN(a)) return false;
				a = a>that.pageCount ? that.pageCount :
					a<1 ? 1 : a;
				if(options.useAjax){
					options.pageNumber = Number(a);
					if(options.onChangePage)
						options.onChangePage.call(that, options.pageNumber, that.pageCount);
					that.update(options.pageNumber);
				}else{
					if(that.pageNumberRegExp.test(location.href)){
						location.href = location.href.replace(that.pageNumberRegExp,"$1"+a);
					}else{
						location.href += (/\?/.test(location.href)?'&':'?') + options.pageNumberQueryName + '=' + a;
					}
				}
				return false;
			});
			if(options.useAjax)
				$(render).on('click', '.pn:not(.disabled)', function(){
					options.pageNumber = Number(this.getAttribute('pageNumber'));
					if(options.onChangePage)
						options.onChangePage.call(that, options.pageNumber, that.pageCount);
					that.update(options.pageNumber);
				});
		},
		getNaviNode: function(url, page, show){
			var options = this.userOptions;
			if(!options.useAjax){
				url = url.replace(this.pageNumberRegExp, "$1"+page);
			}
			var c = (function(){
				if(show===options.prePageAlias) return ' prev';
				else if(show===options.nextPageAlias) return ' next';
				else return '';
			})();
			if(page<1 || page>this.pageCount){
				c += ' disabled';
			}
			url = '<a href="'+(page>0&&page<=this.pageCount?url:'javascript:;')+'" pageNumber="'+page+'" class="pn'+c+'">'+show+'</a>';
			return url;
		},
		getPlainChild: function(text){
			return '<a href="javascript:;" class="'+(text==='...' ? 'plain' : 'current')+'">'+text+'</a>';
		},
		navishow: function(cur, page, url, show){
			show = show==undefined ? 11 : show;
			var hf = Math.floor(show/2),
				i = 0,
				str = '<div class="pc">',
				options = this.userOptions;
			if(options.showPreNextOnEdge || options.showPreNext&&cur>1)
				str += this.getNaviNode(url, cur-1, options.prePageAlias||"上一页");
			if(page<=show){
				for(i=1; i<=page; i++){
					if(i == cur)
						str += this.getPlainChild(i);
					else
						str += this.getNaviNode(url, i, i);
				}
			}else{
				if((cur-2) < (hf+2)){
					for(i=1; i<=cur; i++){
						if(i == cur)
							str += this.getPlainChild(i);
						else
							str += this.getNaviNode(url, i, i);
					}
				}else{
					str += this.getNaviNode(url, 1, 1);
					if(page != show+1) str += this.getPlainChild('...');
					for(i=cur-hf+((page-cur-hf>0)?0:(page-cur-hf)); i<=cur; i++){
						if(i == cur)
							str += this.getPlainChild(i);
						else
							str += this.getNaviNode(url, i, i);
					}
				}
				if(page-cur<hf+3){
					for(i=cur+1; i<=page; i++){
						if(i == cur)
							str += this.getPlainChild(i);
						else
							str += this.getNaviNode(url, i, i);
					}
				}else{
					cur = parseInt(cur, 10);
					for(i=cur+1; i<=(cur+hf-((cur-hf>1)?0:(cur-hf-1))); i++){
						if(i == cur)
							str += this.getPlainChild(i);
						else
							str += this.getNaviNode(url, i, i);
					}
					if(page != show+1)
						str +=  this.getPlainChild('...');
					str += this.getNaviNode(url, page, page);
				}
			}
			if(options.showPreNextOnEdge || options.showPreNext && cur!=page)
				str += this.getNaviNode(url, cur+1, options.nextPageAlias||"下一页");
			return str + '</div>';
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		var $this = $(this);
		var instance = handler(this, $.extend(true, {render:this}, options));
		var ui = $this.data('ui');
		if(ui)
			ui.iPagination = instance;
		else
			$this.data('ui', {iPagination:instance});
	});
};
/* vim: set fdm=marker */
