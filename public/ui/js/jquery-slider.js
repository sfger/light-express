$.fn.slider = function(options){//{{{
	options = $.extend(true, {
		interval: 3e3,
		auto: true,
		nextButton: null,
		prevButton: null,
		miniMap: 'auto',
	}, options);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	handler.prototype = {
		init: function(box, options){
			var store = this.store = {
				hover:false,
				options: null,
				timer: null,
				$list: null,
				listLength: 0,
				$miniMap: null
			};
			var $list = store.$list = $(box).find('>ul>li');
			store.options = options;
			store.box = box;
			store.listLength = store.$list.length;
			if(!store.listLength) throw new Error('no slider items');
			var $active_item = store.$list.filter('.active');
			if( !$active_item.length ) $active_item = $list.eq(0).addClass('active');
			if(options.miniMap){
				if(options.miniMap===true || options.miniMap==='auto'){
					var $ret   = $('<div class="map-control"><ul></ul></div>');
					var index = $list.filter('.active').index();
					for(var i=0,il=store.listLength; i<il; i++){
						$('ul', $ret).append('<li class="'+(index===i?'active':'')+'"></li>');
					}
					store.$miniMap = $ret.find('li');
					if(options.miniMap==='auto' && store.listLength==1){
						$ret.hide();
						$(store.prevButton).hide();
						$(store.nextButton).hide();
					}
					$(box).append($ret);
				}else if($.type(options.miniMap)=='string' && $(options.miniMap).length){
					store.$miniMap = $(options.miniMap);
				}
				store.$miniMap.eq($active_item.index()).addClass('active');
			}
			this.event();
			if( options.auto ) this.autoSlider();
		},
		go: function(n, force){
			force = force===false ? true : false; // 是否强制切换（鼠标在滚动元素范围内时停止自动滚动）
			if(this.store.hover && force) return false;
			if(n==0) return false;
			this.goTo( this.store.$list.filter('.active').index() + n );
		},
		goTo: function(index){
			var len = this.store.listLength;
			while(index>=len) index -= len;
			while(index<0) index += len;
			this.goToByElement( this.store.$list.get(index) );
		},
		goToByElement: function(el){
			if(document.visibilityState=='hidden') return false;
			if($(el).hasClass('active')) return false;
			var index = $(el).index();
			var $list = this.store.$list;
			var $miniMap = this.store.$miniMap;
			var $from = $list.filter('.active');
			var $to   = $list.eq(index);
			$list.removeClass('active').eq(index).addClass('active');
			$miniMap && $miniMap.removeClass('active').eq(index).addClass('active');
			if( options.onSlider ) options.onSlider($from[0], $to[0]);
			if( options.auto ) this.autoSlider();
		},
		event: function(){
			var that  = this;
			var store = this.store;
			var options = store.options;
			$(options.prevButton).click(function(){ that.go(-1); });
			$(options.nextButton).click(function(){ that.go(1); });
			store.$miniMap && store.$miniMap.click(function(){ that.goToByElement(this); });
			options.onCreate && setTimeout(function(){
				options.onCreate(store.options.render);
			}, 0);
			options.auto && $(store.options.render).hover(function(){
				store.hover = true;
			}, function(){
				store.hover = false;
				that.autoSlider();
			});
		},
		autoSlider: function(){
			var that  = this;
			var store = this.store;
			clearTimeout(store.timer);
			store.timer = setTimeout(function(){
				that.go(1, false);
				that.autoSlider();
			}, store.options.interval);
		},
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		var $this = $(this);
		var instance = handler(this, $.extend(true, {render:this}, options));
		var ui = $this.data('ui');
		if(ui) ui.iSlider = instance;
		else $this.data('ui', {iSlider:instance});
	});
};//}}}
