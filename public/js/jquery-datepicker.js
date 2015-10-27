$.fn.datePicker = function(o){
	var op = $.extend(true, {
		monthNum:1,
		proxy:$('body'),
		onComplete: function(){}
	}, o);
	var tpl =
		'<div class="dtp-ctn">' +
				'<a href="javascript:" class="dtp-switcher dtp-prev">&lt;</a>' +
				'<a href="javascript:" class="dtp-switcher dtp-next">&gt;</a>' +
			'<div class="dtp-header">' +
				'<ul class="cf">' +
					'<li></li>' +
				'</ul>' +
			'</div>' +
			'<div class="dtp-list cf">' +
				'<div class="dtp-item">' +
					'<ul class="dtp-wh cf">' +
						'<li class="item day weekend">日</li>' +
						'<li class="item day">一</li>' +
						'<li class="item day">二</li>' +
						'<li class="item day">三</li>' +
						'<li class="item day">四</li>' +
						'<li class="item day">五</li>' +
						'<li class="item day weekend">六</li>' +
					'</ul>' +
					'<ul class="dtp-wd cf">' +
					'</ul>' +
				'</div>' +
			'</div>' +
		'</div>';
	var draw_ui = function(val, selected, render){
		selected = selected!==undefined ? selected : true;
		var ret = $(tpl);
		var n;
		if(op.monthNum>1){
			var ul = ret.find('.dtp-header ul');
			var list = ret.find('.dtp-list');
			for(n=0; n<op.monthNum-1; n++){
				ul.append(ul.find('li').eq(0).clone());
				list.append(list.find('.dtp-item').eq(0).clone());
			}
		}
		var dh = date_helper();
		dh.set_date(val);
		for(n=0; n<op.monthNum; n++){
			var dd = dh.current_date;
			var abd;
			if(op.minDate){
				switch(typeof op.minDate){
					case 'string':
						abd = op.minDate;
						break;
					case 'function':
						abd = op.minDate();
						break;
					default:
						break;
				}
			}
			var sdate = dh.get_first_date_of_month(); // First date
			var sday  = sdate.php_date('w');          // First date's day
			var total = sdate.php_date('t');          // Total days
			var ii    = 1;                            // 第几天
			var dl    = '';                           // li elements string

			for(var i =0; i<42; i++){
				var sc = ''; // element class
				var fd = sdate.php_date('Y-m-'+date_helper.pad(ii, 2));
				if(fd<abd) sc = ' class="disabled"';
				else if(i<sday||ii>total) sc = ' class="disabled"';
				else if(fd==dd && selected || render && fd==render.value) sc = ' class="selected"';
				var show = i<sday||ii>total ? date_helper.date('j', sdate.current_timestamp+(-sday+i)*86400) : ii++; // 显示日期
				dl += '<li' + sc + '>' + show + '</li>';
			}
			$('.dtp-header li', ret).eq(n).html('<a href="javascript:;">'+sdate.php_date('Y')+'</a>'+'年'+'<a href="javascript:;">'+sdate.php_date('n')+'</a>'+'月');
			$('.dtp-wd', ret).eq(n).append(dl);
			$('.dtp-item', ret).eq(0).css({borderColor:'white'});
			if(render && render.ui && render.ui.renderTo) render.ui.renderTo.innerHTML = ret.html();
			else ret.appendTo('body');
			dh.get_offset_date(1, 'm');
		}
		return ret.get(0);
	};
	return this.each(function(){
		var that = this;
		var $this = $(this);
		var val = this.value;
		this.ui = {
			hovered: false,
			skipdate: val,
			renderTo: draw_ui(val)
		};
		$(this.ui.renderTo).css({
			position:'absolute',
			left: $(that).position().left,
			top: $(that).position().top + that.offsetHeight
		});
		$(this.ui.renderTo).on({
			click: function(){
				that.ui.skipdate = date_helper(that.ui.skipdate).get_offset_date(-Number(op.monthNum), 'm').current_date;
				draw_ui(that.ui.skipdate, false, that);
			}
		}, '.dtp-prev').on({
			click: function(){
				that.ui.skipdate = date_helper(that.ui.skipdate).get_offset_date(Number(op.monthNum), 'm').current_date;
				draw_ui(that.ui.skipdate, false, that);
			}
		}, '.dtp-next').on({
			click: function(){
				that.value = date_helper(that.ui.skipdate).get_first_date_of_month().get_offset_date($(this).closest('.dtp-item').index(), 'm').get_offset_date(Number(this.innerHTML - 1)).current_date;
				$(that.ui.renderTo).hide();
				op.onComplete && op.onComplete.call(that, that.value);
			}
		}, '.dtp-wd li:not(".disabled")').on({
			'mouseenter click': function(){
				that.ui.hovered = true;
			},
			mouseleave: function(){
				that.ui.hovered = false;
			}
		});
		$(this).on({
			'click focus': function(){
				op.proxy.trigger('click');
				draw_ui(that.value, false, that);
				this.ui.hovered = true;
				this.ui.skipdate = this.value;
				$(this.ui.renderTo).show();
			},
			'blur': function(){
				this.ui.hovered = false;
			}
		});
		$(this).next().on({
			click: function(){
				$(that.ui.renderTo).show();
				that.ui.hovered = true;
				return false;
			}
		});
		op.proxy.on({
			click: function(e){
				if(!that.ui.hovered){
					$(that.ui.renderTo).hide();
				}
			}
		});
	});
};
// vim: fdm=marker
