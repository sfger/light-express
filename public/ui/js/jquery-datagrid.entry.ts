declare var $:any;
import "../../public/js/requestAnimationFrame";
// import {createElement} from "../../public/js/parts/fn";
function getType(obj){//{{{
	return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}//}}}
function createElement(node){//{{{
	var cd = '',
		at = [],
		attr = null,
		children = null,
		fn = createElement,
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
					if(key=='className'){
						at.push('class="' + attr[key] + '"');
						continue;
					}else if(key=='style'){
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
}//}}}
$.fn.datagrid = function(options, ...args){
	if('string'===$.type(options)){//{{{
		let ret = this.toArray().map(function(one){
			let ui = $(one).data('ui');
			if(ui && ui.iDatagrid){
				return ui.iDatagrid[options].apply(ui.iDatagrid, args);
			}else{
				throw new Error('UI:datagrid does not init...');
			}
		});
		let len = ret[0].length;
		if(0===len) return this;
		if(1===len) return ret[0];
		else return ret;
	}//}}}
	if(!options.columns.length) throw new Error('datagrid must have columns option！');
	options = $.extend(true, {//{{{
		align            : 'center',  // 内容对齐方式
		colWidth         : 80,        // 默认单元格内容宽度
		rowNum           : false,     // 是否显示行号
		startRowNum      : 1,         // 行号开始值
		triggerRow       : false,     // hover是否高亮整行
		data             : [],        // 数据内容
		sortable         : false,     // 列是否可排序
		sort             : null,      // 排序选项
		dataType         : 'string',  // 数据类型
		remoteSort       : false,     // 是否服务器排序
		autoRowHeight    : true,      // 单元格高度是否自动对齐
		autoColWidth     : true,      // 单元格宽度是否自动对齐
		frozenColumns    : [],        // 冻结列
		frozenEndColumns : [],        // 冻结列
		columns          : []         // 普通列
	}, options);//}}}
	let handler  = function(box, options){ return new handler.prototype.init(box, options); };
	let browser:any = {};// {{{
	let ie = /MSIE (\d+)\.?/.exec(navigator.userAgent);
	if(ie && ie.length && ie[1]){
		browser.ie = true;
		browser.version = Number(ie[1]);
	}// }}}
	function get_table(options, that){//{{{
		function get_head_rows(rows, colsType){//{{{
			if(!rows || (colsType=='frozenColumns')&&!options.frozenColumns.length) return [];
			if(!rows || (colsType=='frozenEndColumns')&&!options.frozenEndColumns.length) return [];
			let il = rows.length - 1;
			return rows.map(function(row, i){
				return createElement({name:'tr', children:(function(){
					let index = 0;
					let nodes = row.map(function(option/*, j*/){
						let title   = option.name || option.field || '';
						let td_attr = {};
						if(option.rowspan) td_attr['rowspan'] = option.rowspan;
						if(option.colspan) td_attr['colspan'] = option.colspan;
						let colspan = option.colspan || 1;
						let isField = colspan==1&&((i==il)||((il+1)==(i+option.rowspan)));
						// console.log(option,i,il,option.rowspan, isField);
						let width = (options.autoColWidth||option.colspan) ? 'auto' : ((option.width||options.colWidth) + 'px');
						let cell_attr = {"class":'cell', "style":{width:width}};
						if(i){
							if(colspan==1){
								while(that[colsType][index]) index++;
								if(isField) that[colsType][index] = option;
							}
							index += colspan;
						}else{
							if(colspan==1) that[colsType].push(option);
							else while(colspan--) that[colsType].push(null);
						}
						if(isField){
							let class_name = ['field'];
							if(options.sortable && option.sortable!==false || option.sortable==true){
								class_name.push('sortable');
							}
							td_attr['class'] = class_name.join(' ');
							cell_attr['data-field'] = option.field;
						}
						return createElement({
							name:'td', attr:td_attr, children:{
								name : 'div',
								attr : {"class":'cell-wrapper'},
								children: {
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
					if(options.rowNum && !i)
						if( options.frozenColumns.length && (colsType=='frozenColumns')
							|| !options.frozenColumns.length && (colsType=='columns')
							|| !options.frozenColumns.length && !options.columns.length && (colsType=='frozenEndColumns') ){
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
		}//}}}
		function get_data_rows(data, cols, colsType){//{{{
			if((colsType==='frozenColumns') && !options.frozenColumns.length) return [];
			return data.map(function(row, i){
				return createElement({
					name:'tr', children:(function(){
						let nodes = [];
						if(options.rowNum){
							if( options.frozenColumns.length && (colsType=='frozenColumns')
								|| !options.frozenColumns.length && options.columns.length && (colsType=='columns')
								|| !options.frozenColumns.length && !options.columns.length && (colsType=='frozenEndColumns') ){
								nodes.push(createElement({
									name:'td', children:{
										name:'div', attr:{'class':'cell-wrapper'}, children:{
											name:'div', attr:{'class':'cell'}, children:i+options.startRowNum
										}
									}
								}));
							}
						}
						cols && cols.forEach(function(option){
							if(!option) return true;
							let field     = option.field,
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
		}//}}}
		let ret:any = {//{{{
			name:'div', attr:{'class':'datagrid-ctn'}, children:{
				name:'div',
				attr:{'class':'view-wrapper grid' + (options.autoRowHeight ? ' autoRowHeight' : '')},
				children:[{
					name:'div',
					attr:{'class':'col-rest col-view auto-view'+(options.frozenColumns.length||options.frozenEndColumns.length ? ' locate-view' : '')},
					children:[{
						name:'div', children:[{
							name:'div', attr:{style:'overflow:hidden'}, children:{
								name:'div', attr:{'class': 'head-wrapper'}, children:{
									name:'table', attr:{'class': 'head'}, children:{
										name:'tbody', children:get_head_rows(options.columns, 'columns')
									}
								}
							}
						}, {
							name:'div', attr:{'class': 'body-wrapper'}, children:{
								name:'table', attr:{'class': 'body'}, children:{
									name:'tbody', children:get_data_rows(options.data, that.columns, 'columns')
								}
							}
						}]
					}]
				}]
			}
		};//}}}
		if(options.frozenColumns.length) ret.children.children.unshift({//{{{
			name:'div', attr:{'class':'col col-view frozen-view frozen-start'}, children:[{
				name:'div', attr:{'class':'head-wrapper'}, children:{
					name:'table', attr:{'class':'frozen head'}, children:{
						name:'tbody', children:get_head_rows(options.frozenColumns, 'frozenColumns')
					}
				}
			}, {
				name:'div', attr:{'class':'body-wrapper'}, children:{
					name:'table', attr:{'class':'frozen body'}, children:{
						name:'tbody', children:get_data_rows(options.data, that.frozenColumns, 'frozenColumns')
					}
				}
			}]
		});//}}}
		if(options.frozenEndColumns.length) ret.children.children.push({//{{{
			name:'div', attr:{'class':'col col-view frozen-view frozen-end'}, children:[{
				name:'div', attr:{'class':'head-wrapper'}, children:{
					name:'table', attr:{'class':'frozen head'}, children:{
						name:'tbody', children:get_head_rows(options.frozenEndColumns, 'frozenEndColumns')
					}
				}
			}, {
				name:'div', attr:{'class':'body-wrapper'}, children:{
					name:'table', attr:{'class':'frozen body'}, children:{
						name:'tbody', children:get_data_rows(options.data, that.frozenEndColumns, 'frozenEndColumns')
					}
				}
			}]
		});//}}}
		return createElement(ret);
	}//}}}
	function getHW(el, type){//{{{
		if(!el) return false;
		el.style && (el.style[type] = '');
		return el['offset'+(type==='width'?'Width':'Height')];
	}//}}}
	function align_cell_column(arr, type){//{{{
		for(let i=0,il=arr.length; i<il; i++){
			let column = arr[i];
			let max = column.map(function(one){
				return getHW(one, type);
			}).reduce(function(a, b){
				return a>=b ? a : b;
			}, 0) + Math.ceil(il/2) + 'px';
			column.forEach(function(t){
				if(t&&t.style) t.style[type] = max;
			});
		}
	}//}}}
	function align_cell_row(arr, type){//{{{
		let len = arr.length;
		for(let i=0,il=arr[0].length; i<il; i++){
			let j=0, row = [];
			while(j < len) row.push(arr[j++][i]);
			let max = row.map(function(one){
				return getHW(one, type);
			}).reduce(function(a, b){
				return a>=b ? a : b;
			}, 0) + Math.ceil(len/2) + 'px';
			row.forEach(function(t){
				if(t&&t.style) t.style[type] = max;
			});
		}
	}//}}}
	function set_table_height(val, that, $autoView){
		$autoView = $autoView || $('.auto-view', that.render);
		let header_height = $autoView.find('.head-wrapper')[0].offsetHeight;
		$('.body-wrapper', that.render).css({height:val - header_height});
	}
	function resize_table(that){//{{{
		let $tables = $('table', that.render);
		let $autoView  = $('.auto-view', that.render);
		let $autoTable = $('table', $autoView).parent();
		let tp0 = $autoTable.eq(0);
		let tp1 = $autoTable.eq(1);
		let auto = $autoView.find('.body-wrapper')[0];
		$autoTable.css({width:500000});
		let options = that.userOptions;
		function update_scroll_offset(){
			let aview:any = tp0[0].parentNode;
			aview.scrollLeft = this.scrollLeft;
			if(options.frozenColumns.length){
				let fview:any = $tables[1].parentNode;
				fview.scrollTop = this.scrollTop;
			}
			if(options.frozenEndColumns.length){
				let feview:any = $('.frozen-end table', that.render)[1].parentNode;
				feview.scrollTop = this.scrollTop;
			}
		}
		$('.auto-view .body-wrapper', that.render).off('scroll').on('scroll', function(){
			// let data = that.relatedData;
			// if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
			if(this._scroll_id){
				cancelAnimationFrame(this._scroll_id);
				this._scroll_id = null;
			}
			this._scroll_id = requestAnimationFrame(update_scroll_offset.bind(this));
		});
		if(options.autoColWidth){
			let column = that.fieldElements;
			if(options.rowNum) column = [$('tr:eq(0) td:eq(0) .cell', $tables[0])[0]].concat(column);
			align_cell_row([
				column,
				$tables.filter('table:odd').find('tr:first-child td .cell').toArray()
			], 'width');
		}else if(options.rowNum){
			align_cell_row([
				$('tr:eq(0) td:eq(0) .cell:eq(0)', $tables[0]).toArray(),
				$('tr:first-child td:first-child .cell', $tables[1]).toArray()
			], 'width');
		}
		if(options.frozenColumns || options.frozenEndColumns){
			$([$tables[1], $tables[5]]).off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function(e){
				// let data = that.relatedData;
				// if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
				let originalEvent:any = e.originalEvent;
				let tb3:any = $tables[3].parentNode;
				let list = [tb3, $tables[1].parentNode];
				if($tables[5]) list.push($tables[5].parentNode);
				if($(list).is(':animated')) return false;
				let scroll_height = tb3.scrollHeight - tb3.clientHeight;
				let _sh = tb3.scrollTop - (originalEvent.wheelDelta || -(originalEvent.detail/3)*120);
				$(list).animate({scrollTop:'+'+(_sh>scroll_height?scroll_height:_sh)+'px'}, 230);
			});
			if(options.autoRowHeight){
				align_cell_row($('table:odd', that.render).toArray().map(function(table){
					return $('td:first-child', table).toArray();
				}), 'height');
			}
			align_cell_column([$tables.filter(':odd').toArray(), $tables.filter(':even').toArray()], 'height');
		}
		align_cell_row([$tables.filter(':odd').toArray(), $tables.filter(':even').toArray()], 'width');

		tp1.css({width:'auto'});
		tp0.parent().css({width:'auto', overflow:'hidden'});
		requestAnimationFrame(function(){
			set_table_height(that.render.offsetHeight, that, $autoView);
			let bar_width = auto.offsetWidth - auto.clientWidth;
			$autoView.css({width: $autoView.find('table')[1].offsetWidth + bar_width});
			requestAnimationFrame(function(){
				let bar_height = auto.offsetHeight - auto.clientHeight;
				let $tables = $('.frozen-view .body-wrapper table', that.render);
				$tables.css({marginBottom:bar_height});
				browser.version<8 && requestAnimationFrame(function(){
					$tables.css({marginBottom:bar_height});
				});
			});
		});
	}//}}}
	handler.prototype = {
		sortOrderDesc: false, //true:desc, false:asc
		init: function(box, options){//{{{
			this.render = box;
			this.update(options);
			this.init_event(options);
			options.onCreate && options.onCreate.bind(this)();
		},//}}}
		update: function(options){// {{{
			if($(this.render).hasClass('state-loading')) return false;
			let that = this;
			$(this.render).addClass('datagrid-render-ctn state-loading');
			setTimeout(function(){
				if('function'===$.type(options.data)){
					options.data(function(data){
						options.data = data;
						that._update(options);
					});
				}else that._update(options);
			}, 0);
			return this;
		},// }}}
		_setOptions: function(options){// {{{
			let old_options = this.userOptions;
			if(old_options){
				if(options.data){
					let data = old_options.data;
					if(data[0].tr || data[0].frozenTr || data[0].frozenEndTr){
						data.forEach(function(rowData){
							delete rowData.tr;
							if(old_options.frozenColumns.length) delete rowData.frozenTr;
							if(old_options.frozenEndColumns.length) delete rowData.frozenEndTr;
						});
					}
					this.userOptions.data = options.data;
					delete options.data;
				}
				options = $.extend(true, {}, this.userOptions, options);
			}
			return options;
		},// }}}
		_update: function(options){//{{{
			let that = this;
			let box  = this.render;
			this.columns          = [];
			this.frozenColumns    = [];
			this.frozenEndColumns = [];
			this.userOptions      = options = this._setOptions(options);
			$(box).empty().append(get_table(options, this));
			this.allColumns = [].concat(this.frozenColumns, this.columns, this.frozenEndColumns);
			// console.log(this.allColumns);
			this.fieldElements = this.allColumns.map(function(option){
				return $('[data-field="'+option.field+'"]', box)[0];
			});
			// console.log(this.fieldElements);

			options.data.forEach(function(rowData, rowNum){
				if(options.frozenColumns.length){
					let tbody:any = $('.frozen-view .body tbody', box)[0];
					rowData.frozenTr = tbody.rows[rowNum];
				}
				if(options.frozenEndColumns.length){
					let tbody:any = $('.frozen-end .body tbody', box)[0];
					rowData.frozenEndTr = tbody.rows[rowNum];
				}
				if(options.columns.length){
					let tbody:any = $('.auto-view .body tbody', box)[0];
					rowData.tr = tbody.rows[rowNum];
				}
			});
			let sort = options.sort;
			if(options.remoteSort){
				let sort_order = (~[true,'desc'].indexOf(sort.order)) ? 'desc' : 'asc';
				$('.head-wrapper [data-field='+sort.field+'] .sort-mark', box).addClass(sort_order);
			}else if(sort){
				this.sortBy({field:sort.field, order:sort.order});
			}
			this.reAlign();
		},//}}}
		resetTableHeight: function(val){
			console.log('val');
			$(this.render).height(val);
			set_table_height(val, this);
			return this;
		},
		reAlign: function(){//{{{
			/* TODO :
			 * 1、全部行、全部列、单行、单列对齐重新对齐功能
			 * */
			let that = this;
			resize_table(this);
			requestAnimationFrame(function(){
				if(browser.version<8){
					let $frozen_view = $('.frozen-view', that.render);
					let $auto_view   = $('.auto-view', that.render);
					$auto_view.css({
						'width': 'auto',
						'margin-left': $frozen_view[0].offsetWidth,
						'margin-right': $frozen_view[1].offsetWidth
					}).find('.body-wrapper').css({'margin-top':'-2px'});
					requestAnimationFrame(function(){
						$frozen_view.eq(1).css({'margin-left':$('.body-wrapper',$auto_view)[0].offsetWidth});
					});
				}
				requestAnimationFrame(function(){
					$(that.render).removeClass('state-loading');
					that.userOptions.onUpdate && that.userOptions.onUpdate.bind(that)();
				});
			});
			return this;
		},//}}}
		init_event: function(options){//{{{
			let that = this;
			let $box = $(this.render);
			if(!options.remoteSort) $box.on('click', '.field.sortable', function(){
				let cell:any = $('.cell', this)[0];
				that.sortBy({
					field: $(cell).data('field'),
					order: !cell.order||that.sortOrderDesc
				}, cell);
			});
			if(options.triggerRow && (options.frozenColumns.length || options.frozenEndColumns.length)) $box.on({
				mouseenter: function(e){
					let target = this;
					let box:any = e.delegateTarget;
					if(box._triggering_in){
						cancelAnimationFrame(box._triggering_in);
						box._triggering_in = null;
					}
					box._triggering_in = requestAnimationFrame(function(){
						let data = that.relatedData;
						if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
						that.relatedData = data = that.userOptions.data[target.rowIndex];
						$([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).addClass('hover');
					});
				},
				mouseleave: function(e){
					let box:any = e.delegateTarget;
					if(box._triggering_out){
						cancelAnimationFrame(box._triggering_out);
						box._triggering_out = null;
					}
					box._triggering_out = requestAnimationFrame(function(){
						let data = that.relatedData;
						if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
						that.relatedData = null;
					});
				}
			}, '.body-wrapper tr');
		},//}}}
		sortType: {//{{{
			'string': function(a, b){ // this指{field:field, order:order}
				let field = this.field;
				let x = a[field];
				let y = b[field];
				if(x==y) return 0;
				return x>y ? 1 : -1;
			},
			'number': function(a, b){
				let field = this.field;
				return a[field] - b[field];
			}
		},//}}}
		getFieldOption: function(fieldName){//{{{
			return this.allColumns.filter(function(one){
				return one.field===fieldName;
			})[0];
		},//}}}
		getColumnSortFunction: function({order, field}){//{{{
			let field_option = this.getFieldOption(field); // 列的选项
			if(!field_option){
				console.log({order, field}, 'Field not found......');
				throw new Error('Field not found:'+field);
			}
			let sort_type = field_option.dataType || this.userOptions.dataType || 'string'; // 排序的类型
			let fn        = field_option.sort     || this.sortType[sort_type]; // 排序的函数
			return function(a, b){ return fn.call({order, field}, a, b) * (order ? -1 : 1); };
		},//}}}
		sortBy: function({order, field}, sortElement){//{{{
			//order: (true||'desc')->desc, (false||not 'desc')->asc
			let options        = this.userOptions;
			let preSortElement = this.sortElement;
			order = (~[true,'desc'].indexOf(order)) ? true : false;
			this.sortElement = sortElement = sortElement || $('.head-wrapper [data-field='+field+']', this.render)[0];
			if(preSortElement){
				if(sortElement===preSortElement){ // 同一列
					if(order===preSortElement.order) return this; // 排序没变中断
					options.data = options.data.reverse();
				}
				$('.sort-mark', preSortElement).removeClass('asc desc');
			}
			$('.sort-mark', sortElement).addClass(order?'desc':'asc');
			options.data.sort(this.getColumnSortFunction({order, field}));
			sortElement.order = order;
			sortElement.field = field;
			let that = this;
			$(this.render).addClass('state-loading');
			setTimeout(function(){
				that.sort_table_dom(options);
				setTimeout(function(){
					$(that.render).removeClass('state-loading');
				}, 0);
			}, 0);
			return this;
		},//}}}
		sort_table_dom: function(options){//{{{
			let frozenTrDoc    = document.createDocumentFragment(),
				frozenEndTrDoc = document.createDocumentFragment(),
				trDoc          = document.createDocumentFragment(),
				frozenTbody    = null,
				frozenEndTbody = null,
				tbody          = null;
			options.data.forEach(function(rowData, rowNum){
				let frozenTr    = rowData.frozenTr;
				let frozenEndTr = rowData.frozenEndTr;
				let tr          = rowData.tr;
				if(frozenTr){
					frozenTbody||(function(){
						frozenTbody = frozenTr.parentNode;
						frozenTbody.style.display = 'none';
					})();
					frozenTrDoc.appendChild(frozenTr);
					if(options.rowNum) $('td:eq(0) .cell', frozenTr).text(rowNum+1);
				}
				if(frozenEndTr){
					frozenEndTbody||(function(){
						frozenEndTbody = frozenEndTr.parentNode;
						frozenEndTbody.style.display = 'none';
					})();
					frozenEndTrDoc.appendChild(frozenEndTr);
				}
				if(tr){
					tbody||(function(){
						tbody = tr.parentNode;
						tbody.style.display = 'none';
					})();
					trDoc.appendChild(tr);
					if(!frozenTr && options.rowNum) $('td:eq(0) .cell', tr).text(rowNum+1);
				}
			});
			if(frozenTbody && (frozenTrDoc.children || frozenTrDoc.childNodes)){
				frozenTbody.appendChild(frozenTrDoc);
				frozenTbody.style.display = '';
			}
			if(frozenEndTbody && (frozenEndTrDoc.children || frozenEndTrDoc.childNodes)){
				frozenEndTbody.appendChild(frozenEndTrDoc);
				frozenEndTbody.style.display = '';
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
		let $this = $(this);
		let instance = handler(this, $.extend(true, {}, options));
		let ui = $this.data('ui');
		if(ui) ui.iDatagrid = instance;
		else $this.data('ui', {iDatagrid:instance});
	});//}}}
};
// vim: fdm=marker
