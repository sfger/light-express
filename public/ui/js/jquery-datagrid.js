// requestAnimationFrame {{{
(function() {
	'use strict';
	var vendors = ['webkit', 'moz'];
	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
		var vp = vendors[i];
		window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
		window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
			|| window[vp+'CancelRequestAnimationFrame']);
	}
	if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
	|| !window.requestAnimationFrame || !window.cancelAnimationFrame) {
		var lastTime = 0;
		window.requestAnimationFrame = function(callback) {
			var now = Date.now();
			var nextTime = Math.max(lastTime + 16, now);
			return setTimeout(function() { callback(lastTime = nextTime); }, nextTime - now);
		};
		window.cancelAnimationFrame = clearTimeout;
	}
}());
// }}}
$.fn.datagrid = function(options){
	var type = $.type(options);
	if(type==='string'){
		var args = Array.prototype.slice.call(arguments).slice(1);
		var ret = [];
		for(var oi=0,oil=this.length; oi<oil; oi++){
			var ui = $(this[oi]).data('ui');
			if(ui && ui.iDatagrid){
				ret.push(ui.iDatagrid[options].apply(ui.iDatagrid, args));
			}else{
				throw new Error('UI:datagrid does not init...');
			}
		}
		var len = ret.length;
		if(0===len) return this;
		if(1===len) return ret[0];
		else return ret;
	}
	options = $.extend(true, {
		colWidth      : 80,
		startRowNum   : 1,
		data          : [],
		frozenColumns : [],
		sortable      : false,
		sort          : false,
		columns       : []
	}, options);
	var handler   = function(box, options){ return new handler.prototype.init(box, options); };
	var markChars = {up: '↑', down : '↓', empty:'&nbsp;'};
	var push      = Array.prototype.push;
	var toString  = Object.prototype.toString;
	var getType   = function(obj){ return toString.call(obj).slice(8, -1); };
	// createElement{{{
	var createElement = function(node){
		var cd = '',
			at=[],
			attr = null,
			children = null,
			fn = createElement,
			node_type = getType(node);
		if(node_type === 'Array'){
			for(var j in node) cd += fn(node[j]);
		}else{
			if(node_type==="String" || node_type=="Number"){
				cd = node;
			}else if(node_type==='Object' && node.name){
				attr = node.attr, children = node.children, at = [];
				if(attr){
					for(var key in attr){
						if(key=='style'){
							var style = attr[key];
							var ot = getType(style);
							attr[key] = '';
							if(ot=='Object'){
								for(var sk in style){
									attr[key] += sk + ':' + style[sk] + ';';
								}
							}else if(ot=='String'){
								attr[key] = style;
							}
						}
						at.push('' + key + '="' + attr[key] + '"');
					}
				}
				if(at.length) at.unshift('');
				if(children && getType(children) !== 'Array') children = [children];
				cd = '<' + node.name + at.join(' ') + '>' + (children ? fn(children) : '') + '</' + node.name + '>';
			} else cd = '';
		}
		return cd;
	};
	// }}}

	// fn get_table{{{
	var get_table = function(options, that){
		var get_head_rows = function(rows, isFrozen){
			if(!rows || isFrozen&&!options.frozenColumns.length) return [];
			var colsType = isFrozen ? 'frozenColumns' : 'columns';
			var il = rows.length - 1;
			return rows.map(function(row, i){
				return createElement({name:'tr', children:(function(){
					var nodes = row.map(function(option/*, j*/){
						var title = (option.name || option.field || '');
						var width = (options.autoColWidth||option.colspan) ? 'auto' : ((option.width||options.colWidth) + 'px');
						var td_attr = {};
						if(option.rowspan) td_attr.rowspan = option.rowspan;
						if(option.colspan) td_attr.colspan = option.colspan;
						var colspan = option.colspan || 1;
						var isField = colspan==1&&((i==il)||((il+1)==(i+(option.rowspan||1))));
						if(isField){
							that[colsType].push(option);
							var class_name = ['field'];
							if(options.sortable && option.sortable!==false || option.sortable==true){
								class_name.push('sortable');
							}
							td_attr['class'] = class_name.join(' ');
						}
						return createElement({
							name:'td', attr:td_attr, children:{
								name: 'div',
								attr: {
									"class"      : 'cell',
									"style"      : {width:width},
									"data-field" : option.field
								}, children: [
									markChars.empty,
									{name:'span', attr:{'class':'field-title'}, children:title},
									{name:'span', attr:{'class':'sort-mark'}}, markChars.empty
								]
							}
						});
					});
					if(options.frozenColumns.length && isFrozen && i===0 && options.rowNum || !options.frozenColumns.length && i===0 && options.rowNum){
						nodes.unshift(createElement({
							name:'td', attr:{rowspan:(options.frozenColumns.length||options.columns.length), 'class':'field'}, children:{
								name:'div', attr:{'class':'cell'}
							}
						}));
					}
					return nodes;
				})()});
			});
		};
		var get_data_rows = function(data, cols, isLeft){
			if(isLeft && !options.frozenColumns.length) return [];
			return data.map(function(row, i){
				return createElement({
					name:'tr', children:(function(){
						var nodes = [];
						if(options.frozenColumns.length && isLeft && options.rowNum){
							nodes.push(createElement({
								name:'td', children:{
									name:'div', attr:{'class':'cell'}, children:i+options.startRowNum
								}
							}));
						}
						cols && cols.forEach(function(option){
							if(!option) return true;
							var field     = option.field,
								val       = row[field],
								formatter = option.formatter;
							nodes.push(createElement({
								name:'td', children:{
									name:'div', attr:{
										'class':'cell',
										style:{width:options.autoColWidth ? 'auto' : ((option.width||options.colWidth) + 'px')}
									}, children:
										$.type(formatter)==='function' ? formatter(val, row, field) : val
								}
							}));
						});
						return nodes;
					})()
				});
			});
		};
		return createElement({
			name:'div', attr:{'class':'view-wrapper' + (options.autoRowHeight ? ' autoRowHeight' : '')}, children:[{
				name:'div', attr:{'class':'view frozen'}, children:[{
					name:'div', attr:{'class':'head-wrapper'}, children:{
						name:'table', attr:{'class':'frozen head'}, children:{
							name:'tbody', children:get_head_rows(options.frozenColumns, true)
						}
					}
				}, {
					name:'div', attr:{'class':'body-wrapper', style:'overflow:hidden;'}, children:{
						name:'table', attr:{'class':'frozen body'}, children:{
							name:'tbody', children:
								get_data_rows(options.data, that.frozenColumns, true)
						}
					}
				}
			]}, {
				name:'div', attr:{'class': 'view'}, children:[{
					name:'div', attr:{style:'overflow:hidden'}, children:{
						name:'div', attr:{'class': 'head-wrapper'}, children:{
							name:'table', attr:{'class': 'head'}, children:{
								name:'tbody', children:get_head_rows(options.columns)
							}
						}
					}
				}, {
					name:'div', attr:{'class': 'body-wrapper'}, children:{
						name:'table', attr:{'class': 'body'}, children:{
							name:'tbody', children:
								get_data_rows(options.data, that.columns)
						}
					}
				}]
			}]
		});
	};
	// }}}

	//fn adjust_table{{{
	var getHW = function(el, type){
		return (document.documentMode<7 || /MSIE 6/.test(navigator.userAgent))
			? el['offset'+('width'==type ? 'Width' : 'Height')]
			: $(el)[type]();
	};
	var align_table = function(a, b, type){
		var st = type==='width' ? 'Width' : 'Height';
		$(a).each(function(i){
			var t1 = this['offset' + st];
			var t2 = b[i]['offset' + st];
			var t = t1<t2 ? t2 : t1;
			$([this, b[i]])[type](t);
		});
	};
	// var align_tr = align_table;
	var align_td = function(a, type, fieldElements){
		$.each(a, function(i){
			var field = fieldElements[i];
			var t1  = getHW(this, type),
				t2  = getHW(field, type);
			if(t1===t2) return;
			var t = t1<t2 ? t2 : t1;
			$([this, field])[type](t+5);
		});
	};
	var adjust_table = function(tables, that){
		if(tables.length==4){
			var tp0 = tables.eq(2).parent(),
				tp1 = tables.eq(3).parent();
			tp0.css({width:500000});
			tp1.css({width:500000});
			var options = that.userOptions;
			if(options.rowNum || options.frozenColumns)
				align_table($([tables[0], tables[1]]), $([tables[2], tables[3]]), 'height');
			if(options.autoColWidth){
				align_td(tables.filter('table:odd').find('tr:first-child td .cell'), 'width', that.fieldElements);
			}else if(options.rowNum){
				align_td(tables.filter('table:odd').find('td .cell:first'), 'width', that.fieldElements);
			}
			if(options.rowNum || options.frozenColumns)
				align_table($([tables[0], tables[2]]), $([tables[1], tables[3]]), 'width', that.fieldElements);

			var width_full = (document.compatMode === "CSS1Compat"&&!/msie 6/i.test(navigator.userAgent)) ? 'auto' : '100%';
			tp1.css({width:width_full});
			tp0.parent().css({width:width_full, overflow:'hidden'});
			var update_scroll_offset = function(){
				tp0.parent().get(0).scrollLeft = this.scrollLeft;
				tables.get(1).parentNode.scrollTop = this.scrollTop;
			};
			var scroll_id = null;
			$(tp1).on('scroll', function(){
				cancelAnimationFrame(scroll_id);
				scroll_id = requestAnimationFrame(update_scroll_offset.bind(this));
			});
		}
	};
	//}}}
	var defaultSortFn = function(a, b){
		var field = this.field;
		var m = this.order ? -1 : 1;
		if(a[field]==b[field]) return 0;
		return m*(a[field]>b[field] ? 1 : -1);
	};
	handler.prototype = {
		defaultOrder: false, //true:desc, false:asc
		init: function(box, options){
			var $box = $(box);
			$box.addClass('datagrid-ctn cf');

			this.render = box;
			this.update(options);
			// this.update(options);
			this.init_event();
			this.fix_size();

			options.onCreate.bind(this)();
		},
		update: function(options){
			var that = this;
			var box  = this.render;
			options  = $.extend(true, {}, this.userOptions, options);
			$(box).empty(); // 清空内容取消绑定的事件
			this.columns       = [];
			this.frozenColumns = [];
			this.userOptions   = options;
			$(get_table(options, that)).prependTo(box);
			this.fieldElements = $('.field .cell', box);
			adjust_table($('table', box), that);

			/* if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
				$('.view', box).css({height: $('.head-wrapper').get(0).offsetHeight + $('.body-wrapper').get(0).offsetHeight})// css height:100% fix,
					.eq(0).css({width:$('.view', box).eq(0).find('table').eq(0).width()});// css display:inline fix

				// css selector fix
				$('.body-wrapper table, .body-wrapper table tr:first-child td', box).css({borderTop:'none'});
			} */
			(function(){ // css selector fix
				var fie = navigator.userAgent.match(/MSIE (\d*)/);
				if(fie && fie[1]<9){
					$('.view', box).eq(1).find('table, table td:first-child').css({borderLeft:'none'});
				}
			})();
			var allColumns = [];
			push.apply(allColumns, this.frozenColumns);
			push.apply(allColumns, this.columns);
			this.allColumns = allColumns;
			this.dataTbodys = $('.body tbody', box);
			// if(!(options.data[0].tr && options.data[0].frozenTr)|| isReplaceRow){
			options.data.forEach(function(rowData, rowNum){
				if(options.frozenColumns.length)
					rowData.frozenTr = that.dataTbodys[0].rows[rowNum];
				rowData.tr = that.dataTbodys[1].rows[rowNum];
			});
			// }
			var sort = options.sort;
			if(options.remoteSort){
				var sort_order = (-1===[true,'desc'].indexOf(sort.order)) ? 'asc' : 'desc';
				$('.head-wrapper [data-field='+sort.field+'] .sort-mark', box).addClass(sort_order);
			}else if(options.sort){
				this.sortBy({field:sort.field, order:sort.order});
			}
			this.fix_size();
			return true;
		},
		fix_size: function(){
			var that = this;
			that.resize(); //修改样式
			setTimeout(function(){ that.resize(); }, 0); // 再次计算样式，消除滚动条的影响
		},
		resize: function(){
			var dataViews = $('.view', this.render);
			var tables = $('table', dataViews);
			tables.eq(1).parent().css({height:tables.get(3).parentNode.clientHeight});
			dataViews.eq(1).css({width: this.render.clientWidth - 1 - dataViews.get(0).offsetWidth});
		},
		init_event: function(){
			var that    = this;
			var options = this.userOptions;
			var $box    = $(this.render);
			$(window).on('resize', function(){ that.resize(); });
			/* if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
				var hover_binds = {// css tr:hover fix
					mouseenter: function(){ this.style.backgroundColor = '#e6e6e6'; },
					mouseleave: function(){ this.style.backgroundColor = 'transparent'; }
				};
				$box.on(hover_binds, '.head td').on(hover_binds, '.body tr');
			} */
			if(!options.remoteSort){
				$box.on('click', '.field.sortable .cell', function(){
					that.sortBy({
						field: $(this).data('field'),
						order: !this.order||this.defaultOrder
					});
				});
			}
		},
		getColumnOption: function(fieldName){
			return this.allColumns.filter(function(one){
				return one.field===fieldName;
			})[0];
		},
		getColumnSortFunction: function(fieldName){
			return this.getColumnOption(fieldName).sort || defaultSortFn;
		},
		sortBy: function(option){
			//order: (true||'desc')->desc, (false||not 'desc')->asc
			option.order = (-1===[true,'desc'].indexOf(option.order)) ? false : true;
			var sortElement = $('.head-wrapper [data-field='+option.field+']', this.render).get(0);
			var preSortElement = this.sortElement;
			var options = this.userOptions;
			this.sortElement = sortElement;
			if(preSortElement){
				if(sortElement===preSortElement){
					if(option.order===preSortElement.order) return false;
					else options.data = options.data.reverse();
				}
				$('.sort-mark', preSortElement).removeClass('asc desc');
			}
			$('.sort-mark', sortElement).addClass(option.order?'desc':'asc');
			options.data.sort(this.getColumnSortFunction(option.field).bind(option));
			sortElement.order = option.order;
			sortElement.field = option.field;
			var frozenTrDoc   = document.createDocumentFragment(),
				trDoc         = document.createDocumentFragment(),
				frozenTbody   = null,
				tbody         = null;
			options.data.forEach(function(rowData, rowNum){
				var frozenTr = rowData.frozenTr;
				var tr       = rowData.tr;
				if(frozenTr){
					frozenTbody || (function(){
						frozenTbody = frozenTr.parentNode;
						frozenTbody.style.display = 'none';
					})();
					frozenTrDoc.appendChild(frozenTr);
					if(options.rowNum) $('td:eq(0) .cell', frozenTr).text(rowNum+1);
				}
				if(tr){
					tbody || (function(){
						tbody = tr.parentNode;
						tbody.style.display = 'none';
					})();
					trDoc.appendChild(tr);
				}
			});
			if(frozenTrDoc.children || frozenTrDoc.childNodes){
				frozenTbody.appendChild(frozenTrDoc);
				frozenTbody.style.display = '';
			}
			if(trDoc.children || trDoc.childNodes){
				tbody.appendChild(trDoc);
				tbody.style.display = '';
			}
			frozenTrDoc = null, trDoc = null, frozenTbody = null, tbody = null;
			return true;
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		var $this = $(this);
		var instance = handler(this, $.extend(true, {}, options));
		var ui = $this.data('ui');
		if(ui) ui.iDatagrid = instance;
		else $this.data('ui', {iDatagrid:instance});
	});
};
// vim: fdm=marker
