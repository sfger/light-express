(function($, undefined){
"use strict";
$.fn.window = function(options){
	var type = $.type(options);
	if(type==='string'){
		this.each(function(){
			var ui = $(this).data('ui');
			if(ui&&ui.iWindow){
				ui.iWindow[options]();
			}else{
				throw new Error('UI:window does not init...');
				return false;
			}
		});
		return true;
	}
	options = $.extend(true, {
		title: '',
		show: false,
		footer: {}
	}, options);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	handler.prototype = {
		init: function(box, options){
			var $box = $(box);
			var footer = options.footer.formatter ?
				'<div class="window-bar window-footer cf">' + options.footer.formatter() + '</div>'
				: '';
			var ctn = '\
<div class="window-ctn imgc">\
	<div class="window-mask"></div>\
	<div class="window-wrapper imge cf">\
		<div class="window-bar window-header cf">\
			<span class="window-title">' + (options.title||'') + '</span>\
			<a href="javascript:;" class="window-closer">&times;</a>\
		</div>\
		<div class="window-contents"></div>' + footer + '\
	</div>\
	<!--[if lt IE 8]><i class="iecp"></i><![endif]-->\
</div>';
			var w = $(ctn.replace(/(\/?>)\s+|\s+(?=<)/g, '$1')).appendTo(document.body);
			this.userOptions = options;
			this.container   = w.get(0);
			this.render		 = box;
			this.wraper      = $('.window-wrapper', w).get(0);
			this.closer      = $('.window-closer', w).get(0);
			this.contents    = $('.window-contents', w).get(0);
			this.title		 = $('.window-title', w).html(options.title).get(0);
			$box.show().appendTo(this.contents);
			var that = this;
			$(['Height', 'Width']).each(function(i, one){
				that['getView'+one] = (function () {
					var container = "BackCompat" === document.compatMode ? document.body : document.documentElement;
					return function () {
						return container['client'+one];
					};
				}());
				that['getElement'+one] = function (e) {
					if(!e || e.style.display==='none') return 0;
					return e['offset'+one];
				};
			});

			$(this.closer).on('click', function(e){
				that.close();
				return false;
			});
			if(options.show) this.show();
			var isIE6      = /MSIE 6.0/.exec(navigator.userAgent);
			var css1compat = document.compatMode === "CSS1Compat";
			if(isIE6 || !css1compat) $(window).resize(function(){that.resize();});
		},
		resize: function(){
			var $container = $(this.container);
			if($container.is(':visible')){
				$container.css({
					width: this.getViewWidth(),
					height: this.getViewHeight()
				});
			}
		},
		show: function(){
			var html = document.documentElement;
			var body = document.body;
			body.style.width = body.offsetWidth + 'px';
			var $container = $(this.container),
				$contents  = $(this.contents),
				wraper     = this.wraper;
			if($container.is(':visible')) return false;

			var options	   = this.userOptions;
			if(options.onBeforeOpen){
				if(!options.onBeforeOpen()){
					return false;
				}
			}

			$([html, body]).css({overflow:'hidden'});
			$container.show();
			var contentWidth = this.render.offsetWidth;
			$container.find('.window-bar').css({width:contentWidth});
			// $(wraper).css({width:contentWidth});
			var css1compat = document.compatMode === "CSS1Compat";
			var isIE6      = /MSIE 6.0/.exec(navigator.userAgent);
			if(isIE6 || !css1compat){
				var scrollTop = html.scrollTop || window.pageYOffset || body.scrollTop;
				$container.css({
					width      : this.getViewWidth(),
					height     : this.getViewHeight(),
					'position' : 'absolute',
					'top'      : scrollTop
				});
				$container.hide();
				$container.show();
			}
			if(options.onOpen) options.onOpen();
			return this;
		},
		close: function(){
			var options = this.userOptions;
			if( options.onBeforeClose
				&& typeof options.onClose==='function'
				&& !options.onBeforeClose() ) return false;
			document.body.style.width = '';
			this.container.style.display = 'none';
			$([document.documentElement, document.body]).css({overflow:''});
			if(options.onClose && typeof options.onClose==='function') options.onClose();
			return this;
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		$(this).data('ui', {
			iWindow: handler(this, $.extend({}, options))
		});
	});
};
})(jQuery);
