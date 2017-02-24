import "../../public/js/requestAnimationFrame";
import {createElement} from "../../public/js/parts/fn";
$.fn.datagrid = function(options, ...args){
	if('string'===$.type(options)){//{{{
		// let args = Array.prototype.slice.call(arguments).slice(1);
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
	var handler  = function(box, options){ return new handler.prototype.init(box, options); };
	function get_table(options, that){//{{{
		function get_head_rows(rows, colsType){//{{{
			if(!rows || (colsType=='frozenColumns')&&!options.frozenColumns.length) return [];
			if(!rows || (colsType=='frozenEndColumns')&&!options.frozenEndColumns.length) return [];
			let il = rows.length - 1;
			return rows.map(function(row, i){
				return createElement({name:'tr', children:(function(){
					let index = 0;
					let nodes = row.map(function(option/*, j*/){
						var title = (option.name || option.field || '');
						var td_attr = {};
						if(option.rowspan) td_attr['rowspan'] = option.rowspan;
						if(option.colspan) td_attr['colspan'] = option.colspan;
						var colspan = option.colspan || 1;
						var isField = colspan==1&&((i==il)||((il+1)==(i+option.rowspan)));
						var width = (options.autoColWidth||option.colspan) ? 'auto' : ((option.width||options.colWidth) + 'px');
						var cell_attr = {"class":'cell', "style":{width:width}};
						if(i){
							if(colspan==1){
								while(that[colsType][index]) index++;
								that[colsType][index] = option;
							}
							index += colspan;
						}else{
							if(colspan==1) that[colsType].push(option);
							else while(colspan--) that[colsType].push(null);
						}
						if(isField){
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
						var nodes = [];
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
		}//}}}
		var ret = {//{{{
			name:'div', attr:{'class':'datagrid-ctn'}, children:{
				name:'div',
				attr:{'class':'view-wrapper grid layout-auto' + (options.autoRowHeight ? ' autoRowHeight' : '')},
				children[]
			}
		};//}}}
		if(options.frozenColumns.length) ret.children.children.push({//{{{
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
		if(options.columns.length) ret.children.children.push({//{{{
			name:'div', attr:{'class':'col-rest col-view auto-view'+(options.frozenColumns.length||options.frozenEndColumns.length ? ' locate-view' : '')}, children:[{
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
		for(var i=0,il=arr.length; i<il; i++){
			var column = arr[i];
			var max = column.map(function(one){
				return getHW(one, type);
			}).reduce(function(a, b){
				return a>=b ? a : b;
			}, 0) + Math.ceil(il/2) + 'px';
			column.forEach(function(t){
				t.style[type] = max;
			});
		}
	}//}}}
	function align_cell_row(arr, type){//{{{
		var len = arr.length;
		for(var i=0,il=arr[0].length; i<il; i++){
			var j=0, row = [];
			while(j < len) row.push(arr[j++][i]);
			var max = row.map(function(one){
				return getHW(one, type);
			}).reduce(function(a, b){
				return a>=b ? a : b;
			}, 0) + Math.ceil(len/2) + 'px';
			row.forEach(function(t){
				t.style[type] = max;
			});
		}
	}//}}}
	function resize_table(that){//{{{
		var tables = $('table', that.render);
		var $autoView  = $('.auto-view', that.render);
		var $autoTable = $('table', $autoView).parent();
		var tp0 = $autoTable.eq(0);
		var tp1 = $autoTable.eq(1);
		$autoTable.css({width:500000});
		var options = that.userOptions;
		function update_scroll_offset(){
			let aview:any = tp0.get(0).parentNode;
			aview.scrollLeft = this.scrollLeft;
			if(options.frozenColumns.length){
				let fview:any = tables.get(1).parentNode;
				fview.scrollTop = this.scrollTop;
			}
			if(options.frozenEndColumns.length){
				let feview:any = $('.frozen-end table', that.render).get(1).parentNode;
				feview.scrollTop = this.scrollTop;
			}
		}
		$('.auto-view .body-wrapper', that.render).off('scroll').on('scroll', function(){
			// var data = that.relatedData;
			// if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
			if(this._scroll_id){
				cancelAnimationFrame(this._scroll_id);
				this._scroll_id = null;
			}
			this._scroll_id = requestAnimationFrame(update_scroll_offset.bind(this));
		});
		if(options.autoColWidth){
			align_cell_row([
				(function(){
					var column = that.fieldElements;
					if(options.rowNum) column = [$('tr:eq(0) td:eq(0) .cell', tables[0])[0]].concat(column);
					return column;
				})(),
				tables.filter('table:odd').find('tr:first-child td .cell').toArray()
			], 'width');
		}else if(options.rowNum){
			align_cell_row([
				$('tr:eq(0) td:eq(0) .cell:eq(0)', tables[0]).toArray(),
				$('tr:first-child td:first-child .cell', tables[1]).toArray()
			], 'width');
		}
		if(options.frozenColumns || options.frozenEndColumns){
			$([tables[1], tables[5]]).off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function(e){
				// var data = that.relatedData;
				// if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
				let originalEvent:any = e.originalEvent;
				let tb3:any = tables.get(3).parentNode;
				var list = [tb3, tables.get(1).parentNode];
				if(tables.get(5)) list.push(tables.get(5).parentNode);
				if($(list).is(':animated')) return false;
				var scroll_height = tb3.scrollHeight - tb3.clientHeight;
				var _sh = tb3.scrollTop - (originalEvent.wheelDelta || -(originalEvent.detail/3)*120);
				$(list).animate({scrollTop:'+'+(_sh>scroll_height?scroll_height:_sh)+'px'}, 230);
				return false;
			});
			if(options.autoRowHeight){
				align_cell_row($('table:odd').toArray().map(function(table){
					return $('td:first-child', table).toArray();
				}), 'height');
			}
			align_cell_column([tables.filter(':odd').toArray(), tables.filter(':even').toArray()], 'height');
		}
		align_cell_row([tables.filter(':odd').toArray(), tables.filter(':even').toArray()], 'width');

		tp1.css({width:'auto'});
		tp0.parent().css({width:'auto', overflow:'hidden'});
		// $autoTable.css({width:'auto'});
		$autoView.css({width:$autoTable.find('table')[0].offsetWidth});
		requestAnimationFrame(function(){
			let item = $autoView.find('.body-wrapper')[0];
			let bar_width = item.offsetWidth -item.clientWidth;
			$autoView.css({width: $autoView[0].offsetWidth + bar_width});
		},500);
	}//}}}
	handler.prototype = {
		defaultOrder: false, //true:desc, false:asc
		init: function(box, options){//{{{
			this.render = box;
			this.update(options);
			this.init_event(options);
			options.onCreate.bind(this)();
		},//}}}
		update: function(options){//{{{
			var that = this;
			var box  = this.render;
			var old_options = this.userOptions;
			if(old_options){
				if(options.data){
					var data = old_options.data;
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
			$(box).empty(); // 清空内容取消绑定的事件
			this.columns          = [];
			this.frozenColumns    = [];
			this.frozenEndColumns = [];
			this.userOptions      = options;
			$(get_table(options, that)).prependTo(box);
			this.allColumns = [].concat(this.frozenColumns, this.columns, this.frozenEndColumns);
			this.fieldElements = this.allColumns.map(function(option){
				return $('[data-field="'+option.field+'"]', box).get(0);
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
			var sort = options.sort;
			if(options.remoteSort){
				var sort_order = (~[true,'desc'].indexOf(sort.order)) ? 'desc' : 'asc';
				$('.head-wrapper [data-field='+sort.field+'] .sort-mark', box).addClass(sort_order);
			}else if(sort){
				this.sortBy({field:sort.field, order:sort.order});
			}
			return this.reAlign();
		},//}}}
		reAlign: function(){//{{{
			/* *
			 * TODO::
			 * 1、全部行、全部列、单行、单列对齐重新对齐功能
			 * */
			var that = this;
			resize_table(this);
			requestAnimationFrame(function(){
				var item = $('.auto-view .body-wrapper', that.render)[0];
				$('.frozen-view .body-wrapper table', that.render).css({
					'margin-bottom': item.offsetHeight - item.clientHeight
				});
			});
			requestAnimationFrame(function(){
				var ie = /MSIE (\d+)\.?/.exec(navigator.userAgent);
				var ver;
				if(ie && ie.length && ie[1]){
					ver = Number(ie[1]);
					if(ver<8){
						$('.auto-view', this.render).css({
							'width': 'auto',
							'margin-left': $('.frozen-view', this.render).get(0).offsetWidth,
							'margin-right': $('.frozen-view', this.render).get(1).offsetWidth
						}).find('.body-wrapper').css({'margin-top':'-2px'});
						$('.view-wrapper', this.render).addClass('txt-justify ie-pure-txt');
					}
				}
			});
			return this;
		},//}}}
		init_event: function(options){//{{{
			var that = this;
			var $box = $(this.render);
			if(!options.remoteSort) $box.on('click', '.field.sortable', function(){
				let cell:any = $('.cell', this).get(0);
				that.sortBy({
					field: $(cell).data('field'),
					order: !cell.order||that.defaultOrder
				}, cell);
			});
			if(options.triggerRow && (options.frozenColumns.length || options.frozenEndColumns.length)) $box.on({
				mouseenter: function(e){
					var target = this;
					var box = e.delegateTarget;
					if(box._triggering_in){
						cancelAnimationFrame(box._triggering_in);
						box._triggering_in = null;
					}
					box._triggering_in = requestAnimationFrame(function(){
						var data = that.relatedData;
						if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
						that.relatedData = data = that.userOptions.data[target.rowIndex];
						$([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).addClass('hover');
					});
				},
				mouseleave: function(e){
					var box = e.delegateTarget;
					if(box._triggering_out){
						cancelAnimationFrame(box._triggering_out);
						box._triggering_out = null;
					}
					box._triggering_out = requestAnimationFrame(function(){
						var data = that.relatedData;
						if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
						that.relatedData = null;
					});
				}
			}, '.body-wrapper tr');
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
			if(!field_option){
				console.log(option, 'Field not found......');
				throw new Error('Field not found:'+option.field);
			}
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
			var frozenTrDoc    = document.createDocumentFragment(),
				frozenEndTrDoc = document.createDocumentFragment(),
				trDoc          = document.createDocumentFragment(),
				frozenTbody    = null,
				frozenEndTbody = null,
				tbody          = null;
			options.data.forEach(function(rowData, rowNum){
				var frozenTr    = rowData.frozenTr;
				var frozenEndTr = rowData.frozenEndTr;
				var tr          = rowData.tr;
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
		var $this = $(this);
		var instance = handler(this, $.extend(true, {}, options));
		var ui = $this.data('ui');
		if(ui) ui.iDatagrid = instance;
		else $this.data('ui', {iDatagrid:instance});
	});//}}}
};
// vim: fdm=marker
