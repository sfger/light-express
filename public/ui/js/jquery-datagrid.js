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
	if(type==='string'){//{{{
		var args = Array.prototype.slice.call(arguments).slice(1);
		var ret = [];
		this.each(function(i, element){
			var ui = $(element).data('ui');
			if(ui && ui.iDatagrid){
				ret.push(ui.iDatagrid[options].apply(ui.iDatagrid, args));
			}else{
				throw new Error('UI:datagrid does not init...');
			}
		});
		var len = ret.length;
		if(0===len) return this;
		if(1===len) return ret[0];
		else return ret;
	}//}}}
	options = $.extend(true, {//{{{
		colWidth      : 80,
		startRowNum   : 1,
		data          : [],
		sortable      : false,
		sort          : null,
		dataType      : 'string',
		remoteSort    : false,
		autoRowHeight : true,
		autoColWidth  : true,
		frozenColumns : [],
		columns       : []
	}, options);//}}}
	// var throttle = function(fn, delay, mustRunDelay){//{{{
	// 	var timer = null;
	// 	var t_start;
	// 	return function() {
	// 		var context = this,
	// 			args = arguments,
	// 			t_curr = +new Date();
	// 		clearTimeout(timer);
	// 		if (!t_start) {
	// 			t_start = t_curr;
	// 		}
	// 		if (t_curr - t_start >= mustRunDelay) {
	// 			fn.apply(context, args);
	// 			t_start = t_curr;
	// 		} else {
	// 			timer = setTimeout(function() {
	// 				fn.apply(context, args);
	// 			}, delay);
	// 		}
	// 	};
	// };//}}}
	var handler  = function(box, options){ return new handler.prototype.init(box, options); };
	var toString = Object.prototype.toString;
	var getType  = function(obj){ return toString.call(obj).slice(8, -1).toLowerCase(); };
	var createElement = function(node){//{{{
		var cd        = '',
			at        = [],
			attr      = null,
			children  = null,
			fn        = createElement,
			node_type = getType(node);
		if(node_type === 'array'){
			for(var j in node) cd += fn(node[j]);
		}else{
			if(node_type==="string" || node_type=="number"){
				cd = node;
			}else if(node_type==='object' && node.name){
				attr = node.attr, children = node.children, at = [];
				if(attr){
					for(var key in attr){
						if(key=='style'){
							var style = attr[key];
							var ot = getType(style);
							attr[key] = '';
							if(ot=='object'){
								for(var sk in style){
									attr[key] += sk + ':' + style[sk] + ';';
								}
							}else if(ot=='string'){
								attr[key] = style;
							}
						}
						at.push('' + key + '="' + attr[key] + '"');
					}
				}
				if(at.length) at.unshift('');
				if(children && getType(children) !== 'array') children = [children];
				cd = '<' + node.name + at.join(' ') + '>' + (children ? fn(children) : '') + '</' + node.name + '>';
			} else cd = '';
		}
		return cd;
	};//}}}

	var get_table = function(options, that){//{{{
		var get_head_rows = function(rows, isFrozen){//{{{
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
						var cell_attr = {"class":'cell', "style":{width:width}};
						if(isField){
							that[colsType].push(option);
							var class_name = ['field'];
							if(options.sortable && option.sortable!==false || option.sortable==true){
								class_name.push('sortable');
							}
							td_attr['class'] = class_name.join(' ');
							cell_attr['data-field'] = option.field;
						}
						return createElement({
							name:'td', attr:td_attr, children:{
								name : 'div',
								attr : {
									"class" : 'cell-wrapper'
								}, children: {
									name: 'div',
									attr: cell_attr,
									children: [
										' ',
										{name:'span', attr:{'class':'field-title'}, children:title},
										{name:'span', attr:{'class':'sort-mark'}},
										' '	
									]
								}
							}
						});
					});
					if(options.frozenColumns.length && isFrozen && i===0 && options.rowNum || !options.frozenColumns.length && i===0 && options.rowNum){
						nodes.unshift(createElement({
							name:'td', attr:{rowspan:(options.frozenColumns.length||options.columns.length), 'class':'field'}, children:{
								name:'div', attr:{'class':'cell-wrapper'}, children:{
									name:'div', attr:{'class':'cell'}
								}
							}
						}));
					}
					return nodes;
				})()});
			});
		};//}}}
		var get_data_rows = function(data, cols, isLeft){//{{{
			if(isLeft && !options.frozenColumns.length) return [];
			return data.map(function(row, i){
				return createElement({
					name:'tr', children:(function(){
						var nodes = [];
						if(options.frozenColumns.length && isLeft && options.rowNum){
							nodes.push(createElement({
								name:'td', children:{
									name:'div', attr:{'class':'cell-wrapper'}, children:{
										name:'div', attr:{'class':'cell'}, children:i+options.startRowNum
									}
								}
							}));
						}
						cols && cols.forEach(function(option){
							if(!option) return true;
							var field     = option.field,
								val       = row[field],
								formatter = option.formatter,
								cls_list  = ['cell'],
								align     = ({'left':'txt-lt', 'right':'txt-rt'})[option.align]||'';
							align && cls_list.push(align);
							nodes.push(createElement({
								name:'td', children:{
									name:'div', attr:{'class':'cell-wrapper'}, children:{
										name:'div', attr:{
											'class': cls_list.join(' '),
											style:{width:options.autoColWidth ? 'auto' : ((option.width||options.colWidth) + 'px')}
										}, children:
											$.type(formatter)==='function' ? formatter(val, row, field) : val
									}
								}
							}));
						});
						return nodes;
					})()
				});
			});
		};//}}}
		return createElement({//{{{
			name:'div', attr:{'class':'view-wrapper grid' + (options.autoRowHeight ? ' autoRowHeight' : '')}, children:[{
				name:'div', attr:{'class':'col col-view frozen-view'}, children:[{
					name:'div', attr:{'class':'head-wrapper'}, children:{
						name:'table', attr:{'class':'frozen head'}, children:{
							name:'tbody', children:get_head_rows(options.frozenColumns, true)
						}
					}
				}, {
					name:'div', attr:{'class':'body-wrapper'}, children:{
						name:'table', attr:{'class':'frozen body'}, children:{
							name:'tbody', children:get_data_rows(options.data, that.frozenColumns, true)
						}
					}
				}
			]}, {
				name:'div', attr:{'class':'col-rest col-view auto-view'}, children:[{
					name:'div', children:[{
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
								name:'tbody', children:get_data_rows(options.data, that.columns)
							}
						}
					}]
				}]
			}]
		});//}}}
	};//}}}

	//fn adjust_table{{{
	var getHW = function(el, type){//{{{
		// return (document.documentMode<7 || /MSIE 6/.test(navigator.userAgent))
		// 	? el['offset'+('width'==type ? 'Width' : 'Height')]
		// 	: $(el)[type]();
		// return $(el)[type]();
		return el['offset'+(type==='width'?'Width':'Height')];
	};//}}}
	var align_table = function(a, b, type){//{{{
		var st = 'offset'+(type==='width' ? 'Width' : 'Height');
		$(a).each(function(i){
			var t1 = this[st];
			var t2 = b[i][st];
			var t = t1<t2 ? t2 : t1;
			this.style[type] = b[i].style[type] = t + 'px';
			// $([this, b[i]])[type](t);
		});
	};//}}}
	var align_td = function(a, type, fieldElements){//{{{
		$.each(a, function(i){
			var field = fieldElements[i];
			var t1  = getHW(this, type),
				t2  = getHW(field, type);
			if(t1===t2) return;
			var t = t1<t2 ? t2 : t1;
			this.style[type] = field.style[type] = (t + 3) + 'px';
			// $([this, field])[type](t+3);
		});
	};//}}}
	var adjust_table = function(tables, that){//{{{
		if(tables.length==4){
			var tp0 = tables.eq(2).parent();
			var tp1 = tables.eq(3).parent();
			tp0.css({width:500000});
			tp1.css({width:500000});
			var options = that.userOptions;
			align_td(tables.filter('table:odd').find('tr:first-child td .cell'), 'width', that.fieldElements);
			if(options.rowNum || options.frozenColumns){
				if(options.autoRowHeight){
					align_td($('table:eq(1) td:first-child'), 'height', $('table:eq(3) td:first-child'));
				}
				align_table($([tables[0], tables[1]]), $([tables[2], tables[3]]), 'height');
				align_table($([tables[0], tables[2]]), $([tables[1], tables[3]]), 'width');
			}

			// var width_full = (document.compatMode === "CSS1Compat"&&!/msie 6/i.test(navigator.userAgent)) ? 'auto' : '100%';
			var width_full = 'auto';
			tp1.css({width:width_full});
			tp0.parent().css({width:width_full, overflow:'hidden'});
			var update_scroll_offset = function(){
				tp0.get(0).parentNode.scrollLeft   = this.scrollLeft;
				tables.get(1).parentNode.scrollTop = this.scrollTop;
			};
			$(tp1).off('scroll').on('scroll', function(){
				this._scroll_id && cancelAnimationFrame(this._scroll_id);
				this.scroll_id = requestAnimationFrame(update_scroll_offset.bind(this));
			});
		}
	};//}}}
	//}}}
	handler.prototype = {
		defaultOrder: false, //true:desc, false:asc
		init: function(box, options){//{{{
			$(box).addClass('datagrid-ctn');
			this.render = box;
			// this.reAlign();
			this.init_event(options);
			this.update(options);
			options.onCreate.bind(this)();
		},//}}}
		update: function(options){//{{{
			var that = this;
			var box  = this.render;
			options  = $.extend(true, {}, this.userOptions, options);
			$(box).empty(); // 清空内容取消绑定的事件
			this.columns       = [];
			this.frozenColumns = [];
			this.userOptions   = options;
			$(get_table(options, that)).prependTo(box);
			this.fieldElements = $('.field .cell', box);

			// if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
			// 	$('.col-view', box).css({height: $('.head-wrapper').get(0).offsetHeight + $('.body-wrapper').get(0).offsetHeight})// css height:100% fix,
			// 		.eq(0).css({width:$('.col-view', box).eq(0).find('table').eq(0).width()});// css display:inline fix
			// 	$('.body-wrapper table, .body-wrapper table tr:first-child td', box).css({borderTop:'none'});
			// 	$('.col-view', box).eq(1).find('table, table td:first-child').css({borderLeft:'none'});
			// }
			this.allColumns = [].concat(this.frozenColumns, this.columns);
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
				var sort_order = (~[true,'desc'].indexOf(sort.order)) ? 'desc' : 'asc';
				$('.head-wrapper [data-field='+sort.field+'] .sort-mark', box).addClass(sort_order);
			}else if(options.sort){
				this.sortBy({field:sort.field, order:sort.order});
			}
			this.reAlign();
			// return this.resize();
			return this;
		},//}}}
		reAlign: function(){//{{{
			/* *
			 * TODO::
			 * 1、全部行、全部列、单行、单列对齐重新对齐功能
			 * */
			adjust_table($('table', this.render), this);
			return this;
		},//}}}
		resize: function(){//{{{
			// var render = this.render;
			// var dataViews = $('.col-view', render);
			// var tables = $('table', dataViews);
			// var ie = /MSIE (\d+)\.?/.exec(navigator.userAgent);
			// if(ie && ie.length && ie[1]){
			// 	ie = Number(ie[1]);
			// 	if(ie<10) dataViews.eq(1).css({width: render.clientWidth - 1 - dataViews.get(0).offsetWidth});
			// }
			// tables.eq(1).parent().css({height:tables.get(3).parentNode.clientHeight});
			return this;
		},//}}}
		init_event: function(options){//{{{
			var that    = this;
			var $box    = $(this.render);
			// var ie = /MSIE (\d+)\.?/.exec(navigator.userAgent);
			// if(ie && ie.length && ie[1]){
			// 	ie = Number(ie[1]);
			// 	if(ie<10) $(window).on('resize.datagrid', throttle(function(){ that.resize(); }));
			// }
			// if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
			// 	var hover_binds = {// css tr:hover fix
			// 		mouseenter: function(){ this.style.backgroundColor = '#e6e6e6'; },
			// 		mouseleave: function(){ this.style.backgroundColor = 'transparent'; }
			// 	};
			// 	$box.on(hover_binds, '.head td').on(hover_binds, '.body tr');
			// }
			if(!options.remoteSort){
				$box.on('click', '.field.sortable', function(){
					var cell = $('.cell', this).get(0);
					that.sortBy({
						field: $(cell).data('field'),
						order: !cell.order||that.defaultOrder
					}, cell);
				});
			}
		},//}}}
		sortType: {//{{{
			'string': function(a, b){ // this指{field:field, order:order}
				var field = this.field;
				var x = a[field];
				var y = b[field];
				if(x==y) return 0;
				return x>y ? 1 : -1;
			},
			'number': function(a, b){
				var field = this.field;
				return a[field] - b[field];
			}
		},//}}}
		getFieldOption: function(fieldName){//{{{
			return this.allColumns.filter(function(one){
				return one.field===fieldName;
			})[0];
		},//}}}
		getColumnSortFunction: function(option){//{{{
			var field_option = this.getFieldOption(option.field); // 列的选项
			var sort_type    = field_option.dataType || this.userOptions.dataType || 'string'; // 排序的类型
			var fn           = field_option.sort || this.sortType[sort_type]; // 排序的函数
			return function(a, b){
				return fn.call(option, a, b) * (option.order ? -1 : 1);
			};
		},//}}}
		sortBy: function(option, sortElement){//{{{
			//order: (true||'desc')->desc, (false||not 'desc')->asc
			var options        = this.userOptions;
			var preSortElement = this.sortElement;
			option.order = (~[true,'desc'].indexOf(option.order)) ? true : false;
			this.sortElement = sortElement = sortElement || $('.head-wrapper [data-field='+option.field+']', this.render).get(0);
			if(preSortElement){
				if(sortElement===preSortElement){ // 同一列
					if(option.order===preSortElement.order) return this; // 排序没变中断
					options.data = options.data.reverse();
				}
				$('.sort-mark', preSortElement).removeClass('asc desc');
			}
			$('.sort-mark', sortElement).addClass(option.order?'desc':'asc');
			options.data.sort(this.getColumnSortFunction(option));
			sortElement.order = option.order;
			sortElement.field = option.field;
			return this.sort_table_dom(options);
		},//}}}
		sort_table_dom: function(options){//{{{
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
			if(frozenTbody && (frozenTrDoc.children || frozenTrDoc.childNodes)){
				frozenTbody.appendChild(frozenTrDoc);
				frozenTbody.style.display = '';
			}
			if(tbody && (trDoc.children || trDoc.childNodes)){
				tbody.appendChild(trDoc);
				tbody.style.display = '';
			}
			frozenTrDoc = null, trDoc = null, frozenTbody = null, tbody = null;
			return this;
		}//}}}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){//{{{
		var $this = $(this);
		var instance = handler(this, $.extend(true, {}, options));
		var ui = $this.data('ui');
		if(ui) ui.iDatagrid = instance;
		else $this.data('ui', {iDatagrid:instance});
	});//}}}
};
// vim: fdm=marker
