(function($, undefined){
"use strict";
$.fn.datagrid = function(options){
	var type = $.type(options);
	if(type==='string'){
		this.each(function(){
			var ui = $(this).data('ui');
			if(ui&&ui.iDatagrid){
				ui.iDatagrid[options]();
			}else{
				throw new Error('UI:datagrid does not init...');
			}
		});
		return true;
	}
	options = $.extend(true, {
		colWidth:80,
		startRowNum:1,
		data:[]
	}, options);
	var handler       = function(box, options){ return new handler.prototype.init(box, options); };
	var markChars     = {up: '↑', down : '↓', empty:'&nbsp;'};
	var push          = Array.prototype.push;
	var toString      = Object.prototype.toString;
	var getType = function(obj){ return toString.call(obj).slice(8, -1); };
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
						if(key=='className'){
							at.push('class="' + attr[key] + '"');
							continue;
						}else if(key=='style'){
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
	// fn get_table{{{
	var get_table = function(options, that){
		var get_head_rows = function(rows, isFrozen){
			var ret = [];
			var l = 0;
			var colsType = isFrozen ? 'frozenColumns' : 'columns';
			if(!rows) return ret;
			var il = rows.length - 1;
			var fieldElements = [];
			for(var i=il; i>=0; i--){
				ret.unshift(createElement({name:'tr', children:(function(){
					var nodes = [];
					for(var j=rows[i].length-1; j>=0; j--){
						var option = rows[i][j];
						var title = (option.name || option.field || '');
						var width = (options.autoColWidth||option.colspan) ? 'auto' : ((option.width||options.colWidth) + 'px');
						var td_attr = {};
						if(option.rowspan) td_attr.rowspan = option.rowspan;
						if(option.colspan) td_attr.colspan = option.colspan;
						var colspan = option.colspan || 1;
						var isField = colspan==1&&(i==il||rows.length==(i+(option.rowspan||1)));
						if(isField){
							that[colsType].unshift(option);
							td_attr.className = 'field';
						}
						nodes.unshift(createElement({
							name:'td', attr:td_attr, children:{
								name:'div', attr:{className:'cell', style:{width:width}}, children: [
									markChars.empty,
									{name:'span', attr:{className:'field-title', "data-field":option.field}, children:title},
									{name:'span', attr:{className:'sort-mark'}}, markChars.empty
								]
							}
						}));
					}
					if(isFrozen && i==0 && options.rowNum){
						nodes.unshift(createElement({
							name:'td', attr:{rowspan:options.frozenColumns.length, className:'field'}, children:{
								name:'div', attr:{className:'cell'}
							}
						}));
					}
					return nodes;
				})()}));
			}
			return ret;
		};
		var get_data_rows = function(data, cols, isLeft){
			var ret = [];
			data.forEach(function(row, i){
				ret.push(createElement({
					name:'tr', children:(function(){
						var nodes = [];
						if(options.rowNum && isLeft){
							nodes.push(createElement({
								name:'td', children:{
									name:'div', attr:{className:'cell'}, children:i+options.startRowNum
								}
							}));
						}
						cols && cols.forEach(function(option, ii){
							if(!option) return true;
							var field = option.field,
								val = row[field],
								formatter = option.formatter;
							nodes.push(createElement({
								name:'td', children:{
									name:'div', attr:{
										className:'cell',
										style:{width:options.autoColWidth ? 'auto' : ((option.width||options.colWidth) + 'px')}
									}, children:
										 $.type(formatter)==='function' ? formatter(val, row, field) : val
								}
							}));
						});
						return nodes;
					})()
				}));
			});
			return ret;
		};
		return createElement({
			name:'div', attr:{className:'view-wrapper' + (options.autoRowHeight ? ' autoRowHeight' : '')}, children:[{
				name:'div', attr:{className:'view frozen'}, children:[{
					name:'div', attr:{className:'head-wrapper'}, children:{
						name:'table', attr:{className:'frozen head'}, children:{
							name:'tbody', children:get_head_rows(options.frozenColumns, true)
						}
					}
				}, {
					name:'div', attr:{className:'body-wrapper', style:'overflow:hidden;'}, children:{
						name:'table', attr:{className:'frozen body'}, children:{
							name:'tbody', children:
								get_data_rows(options.data, that.frozenColumns, true)
						}
					}
				}
			]}, {
				name:'div', attr:{className: 'view'}, children:[{
					name:'div', attr:{style:'overflow:hidden'}, children:{
						name:'div', attr:{className: 'head-wrapper'}, children:{
							name:'table', attr:{className: 'head'}, children:{
								name:'tbody', children:get_head_rows(options.columns)
							}
						}
					}
				}, {
					name:'div', attr:{className: 'body-wrapper'}, children:{
						name:'table', attr:{className: 'body'}, children:{
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
		$(a).each(function(i, one){
			var t1 = this['offset' + st];
			var t2 = b[i]['offset' + st];
			var t = t1<t2 ? t2 : t1;
			$([this, b[i]])[type](t);
		});
	};
	var align_tr = align_table;
	var align_td = function(a, type, fieldElements){
		$.each(a, function(i, one){
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
			$(tp1).on('scroll', function(){
				tp0.parent().get(0).scrollLeft = this.scrollLeft;
				tables.get(1).parentNode.scrollTop = this.scrollTop;
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

			var that           = this;
			this.render        = box;
			// if(options.pagination && options.localData){
			// 	box.innerHTML = '<div class="datagrid-pagination"></div>';
			// 	var $pbox = $('.datagrid-pagination', box)
			// 	var pbox = $pbox.get(0);
			// 	options.pagination.renders = [pbox];
			// 	options.pagination.dataSize = options.localData.length;
			// 	(options.pagination);
			// 	var po = pbox.ui.iPagination.userOptions;
			// 	options.data = options.localData.slice((po.pageNumber-1)*po.pageSize, po.pageNumber*po.pageSize);
			// }
			this.updateData(options);
			// this.updateData(options);
			this.init_event();
			this.fix_size();

			options.onCreate.bind(this)();
		},
		updateData: function(options){
			var that    = this;
			var box     = this.render;
			var $box    = $(box);
			$box.empty();
			options = $.extend(true, {}, this.userOptions, options);
			this.columns       = [];
			this.frozenColumns = [];
			this.userOptions   = options;
			$(get_table(options, that)).prependTo(box);
			this.fieldElements = $('.field .cell', box);
			adjust_table($('table', box), that);

			if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
				$('.view', box).css({height: $('.head-wrapper').get(0).offsetHeight + $('.body-wrapper').get(0).offsetHeight})// css height:100% fix,
					.eq(0).css({width:$('.view', box).eq(0).find('table').eq(0).width()});// css display:inline fix

				// css selector fix
				$('.body-wrapper table, .body-wrapper table tr:first-child td', box).css({borderTop:'none'});
			}
			(function(){// css selector fix
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
			if(options.remoteSort || options.sort){
				if(options.remoteSort){
					var fieldIndex = (function(){
						for(var i=0,il=that.allColumns.length; i<il; i++){
							if(options.sort.field===that.allColumns[i].field){
								return (Number(i)||0) + 1;
							}
						}
					})();
					$('.sort-mark', this.fieldElements[fieldIndex]).addClass(options.sort.order=='desc'?'desc':'asc');
				}else{
					this.sortBy(options.sort.field, options.sort.order);
				}
			}
			this.fix_size();
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
			if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
				var hover_binds = {// css tr:hover fix
					mouseenter: function(){ this.style.backgroundColor = '#e6e6e6'; },
					mouseleave: function(){ this.style.backgroundColor = 'transparent'; }
				};
				$box.on(hover_binds, '.head td').on(hover_binds, '.body tr');
			}
			if(!options.remoteSort){
				$box.on('click', '.field', function(e){
					var field = $('.field-title', this).data('field');
					that.sortBy(field, !this.order||this.defaultOrder);
				});
			}
		},
		sortBy: function(field, order){ //order: (true||'desc')->desc, (false||not 'desc')->asc
			order = (-1===[true,'desc'].indexOf(order)) ? false : true;
			var options = this.userOptions;
			var fieldIndex;
			var fieldOption = this.allColumns.filter(function(option, i){
				if(option.field===field){
					fieldIndex = i + 1;
					return true;
				}
				return false;
			})[0];
			var fieldElement = this.fieldElements[fieldIndex].parentNode;
			if(this.sortElement) $('.sort-mark', this.sortElement).removeClass('asc desc');
			this.sortElement = fieldElement;
			$('.sort-mark', fieldElement).removeClass('asc desc').addClass(order?'desc':'asc');
			if(field===fieldElement.field && fieldElement.order===order) return false;
			fieldElement.order = order;
			if((field===fieldOption.field) && (fieldElement.order===!order)){
				fieldElement.field = field;
				options.data = options.data.reverse();
			}else{
				fieldElement.field = field;
				options.data.sort((fieldOption.sort || defaultSortFn).bind({field:field, order:order}));
			}
			var frozenTrDoc = document.createDocumentFragment(),
				trDoc = document.createDocumentFragment(),
				frozenTbody = null,
				tbody = null;
			options.data.forEach(function(rowData, rowNum){
				var frozenTr = rowData.frozenTr;
				var tr = rowData.tr;
				if(frozenTr){
					frozenTbody || (function(){
						frozenTbody = frozenTr.parentNode;
						frozenTbody.style.display = 'none';
					})();
					frozenTrDoc.appendChild(frozenTr);
					if(options.rowNum)
						frozenTr.children[0].children[0].innerHTML = rowNum + 1;
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
})(jQuery);
/* vim: set fdm=marker : */
