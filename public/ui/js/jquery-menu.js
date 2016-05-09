$.fn.menu = function(method, op){
	var type = $.type(method);
	if(type==='string'){
		this.each(function(){
			var ui = $(this).data('ui');
			if(ui&&ui.iMenu){
				ui.iMenu[method](op);
			}else{
				throw new Error('UI:menu does not init...');
			}
		});
		return true;
	}
	var options = $.extend(true, {
		animate: {time:0},
		autoHide: true,
		data: []
	}, method);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	handler.prototype = {
		init: function(box, options){
			var that = this;
			this.userOptions = options;
			var document = window.document;
			// var getType = function(obj){ return toString.call(obj).slice(8, -1); };
			var $box = $(box);
			$box.addClass('menu-ctn cf').hide();
			this.container = box;
			this.menuitems = {};
			var createMenu = function(option){
				var data = option.data;
				var wraper = document.createElement('div');
				wraper.className = 'wraper';
				if(option.width){
					if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
						wraper.style.width = option.width + 2 + 'px';
					}else{
						wraper.style.width = option.width + 'px';
					}
				}
				wraper.style.position = 'relative';
				wraper.innerHTML = '<div class="menu-vertical-line"></div>';
				var ul = document.createElement('ul');
				ul.className = 'cf';
				for(var i=0,ii=data.length-1; i<=ii; i++){
					var li = document.createElement('li');
					var line;
					if(data[i]['class']=='separate'){
						line = document.createElement('span');
						li.className = data[i]['class'];
					}else{
						line = document.createElement('a');
						var icon = document.createElement('span');
						var text = document.createElement('span');
						if(data[i].sub && data[i].sub.data && data[i].sub.data.length){
							var sub_tag = document.createElement('span');
							sub_tag.className = "sub-tag";
							line.appendChild(sub_tag);
						}
						icon.className = 'icon' + (data[i].icon ? ' icon-'+data[i].icon : '');
						line.appendChild(icon);
						text.innerHTML = data[i].text||'';
						text.className = 'text';
						line.appendChild(text);
						line.setAttribute('href', 'javascript:;');
						if(data[i].disabled) line.className = 'disabled';
						if(data[i]['class']) li.className = data[i]['class'];
						that.menuitems[data[i].name] = li;
					}
					line.option = data[i];
					li.appendChild(line);
					if(data[i].sub && data[i].sub.data && data[i].sub.data.length){
						var sub_container = document.createElement('div');
						sub_container.style.display = 'none';
						if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
							sub_container.style.position = 'absolute';
							sub_container.style.marginTop = '-22px';
						}else{
							sub_container.style.position = 'relative';
							sub_container.style.top = '-22px';
						}
						sub_container.style.left = option.width - 2 + 'px';
						sub_container.appendChild(createMenu(data[i].sub));
						sub_container.className = 'menu-ctn cf';
						li.appendChild(sub_container);
					}
					ul.appendChild(li);
				}
				wraper.appendChild(ul);
				return wraper;
			};
			$(createMenu(options)).appendTo(box);
			$box.on({
				mouseenter: function(){
					if(this.showMenuTimer) clearTimeout(this.showMenuTimer);
					this.showMenuTimer = null;
				},
				mouseleave: function(){
					var menu = this;
					this.showMenuTimer = setTimeout(function(){
						menu.style.display = 'none';
						menu.showMenuTimer = null;
						that.hide();
					}, 300);
				}
			}).on({
				click: function(){
					if(this.option.disabled) return false;
					box.style.display = 'none';
					that.userOptions.onClick.bind(this)(this.option);
				},
				mouseenter: function(){
					if(this.option.disabled) return true;
					var sub = this.nextSibling;
					if(sub){
						if(sub.showMenuTimer) clearTimeout(sub.showMenuTimer);
						sub.showMenu = true;
						sub.style.display = '';
						sub.showMenuTimer = null;
					}
				},
				mouseleave: function(){
					var sub = this.nextSibling;
					if(sub && sub.showMenu===true){
						sub.showMenuTimer = setTimeout(function(){
							sub.showMenu = false;
							sub.style.display = 'none';
							sub.showMenuTimer = null;
						}, 300);
					}
				}
			}, 'a').on({
				mouseover: function(){
					if(this.showMenuTimer) clearTimeout(this.showMenuTimer);
					this.showMenu = true;
					this.showMenuTimer = null;
				},
				mouseout: function(){
					var that = this;
					this.showMenuTimer = setTimeout(function(){
						that.showMenu = false;
						that.style.display = 'none';
						that.showMenuTimer = null;
					}, 300);
				}
			}, '.menu-ctn');
			options.onCreate.bind(this)();
		},
		open: function(e){
			this.show(e);
		},
		show: function(e){
			$(this.container).css({left:e.pageX, top:e.pageY}).show();
			if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
				$(this.container).find('.menu-vertical-line').each(function(){
					this.style.height = this.parentNode.offsetHeight + 'px';
				});
			}
			this.userOptions.onShow.bind(this)();
			return this;
		},
		hide: function(){
			$(this.container).hide();
			this.userOptions.onHide.bind(this)();
			return this;
		},
		hideMenuItem: function(name){
			this.menuitems[name].style.display = 'none';
			return this;
		},
		showMenuItem: function(name){
			this.menuitems[name].style.display = '';
			return this;
		},
		/**
		 * option: [Object] just options.data object item
		 * position: [String] before, after
		 * refName: menu item name
		 * */
		addMenuItem: function(option, position, refName){
			var li = document.createElement('li');
			var line;
			if(option['class']=='separate'){
				line = document.createElement('span');
				li.className = option['class'];
			}else{
				line = document.createElement('a');
				var icon = document.createElement('span');
				var text = document.createElement('span');
				icon.className = 'icon' + (option.icon ? ' icon-'+option.icon : '');
				line.appendChild(icon);
				text.innerHTML = option.text||'';
				text.className = 'text';
				line.appendChild(text);
				line.setAttribute('href', 'javascript:;');
				line.option = option;
				if(option.disabled) line.className = 'disabled';
				if(option['class']) li.className = option['class'];
				this.menuitems[option.name] = li;
			}
			li.appendChild(line);
			var $sc, method;
			if(!refName){
				$sc = $('ul', this.container).eq(0);
				if(!position || position=='after'){
					method = 'append';
				}else{
					method = 'prepend';
				}
			}else{
				$sc = $(this.menuitems[refName]);
				if(!position) position = 'after';
				method = position;
			}
			$sc[method](li);
			return this;
		},
		updateMenuItem: function(name, option){
			if(!this.menuitems[name]) return this;
			var $li = $(this.menuitems[name]);
			$li.find('a')[option.disabled ? 'addClass' : 'removeClass']('disabled').get(0).option = option;
			$li.find('.icon').removeClass().addClass('icon'+(option['icon'] ? ' icon-'+option['icon'] : ''));
			$li.find('.text').html(option.text);
			return this;
		},
		deleteMenuItem: function(name){
			if(!this.menuitems[name]) return this;
			this.menuitems[name].option = null;
			$(this.menuitems[name]).remove();
			return this;
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		var $this = $(this);
		var instance = handler(this, $.extend(true, {}, options));
		var ui = $this.data('ui');
		if(ui) ui.iMenu = instance;
		else $this.data('ui', {iMenu:instance});
	});
};
/* vim: set fdm=marker : */
