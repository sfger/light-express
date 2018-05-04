$.fn.tree = function(options){
	var type = $.type(options);
	if(type==='string'){
		var args = Array.prototype.slice.call(arguments).slice(1);
		var ret = [];
		this.each(function(){
			var ui = $(this).data('ui');
			if(ui&&ui.iTree){
				ret.push(ui.iTree[options].apply(ui.iTree, args));
			}else{
				throw new Error('UI:tree does not init...');
			}
		});
		if(options=="isLeaf") return ret[0];
		else return this;
	}
	options = $.extend(true, {
		animate: {time:0},
		data: []
	}, options);
	var handler    = function(box, options){ return new handler.prototype.init(box, options); };
	var createTree = function(data, deep, container, deepest_ul, interal_init){
		if(!deep) deep = 1;
		if(!interal_init){
			container.innerHTML = '<ul data-deep="0"><li class="line" style="display:block;"><a style="display:none;"><span class="title">__ROOT__</span></a></li></ul>';
			container = container.children[0].children[0];
			container.children[0].option = {name:'__ROOT__',children:data};
		}
		var ul = document.createElement('ul');
		ul.setAttribute('data-deep', deep);
		for(var i=0,il=data.length-1; i<=il; i++){
			var name = document.createElement('span'),
				li   = document.createElement('li'),
				line = document.createElement('a');
			ul.appendChild(li);
			ul.setAttribute('data-deep', deep);
			li.appendChild(line);
			// line.href = 'javascript:';
			// line.draggable = true;
			line.className = 'line';
			line.option = data[i];
			var indent = data[i].children ? (deep==1?deep-2:deep-1) : deep;
			for(var j=0; j<indent; j++){
				var span = document.createElement('span');
				line.appendChild(span);
				span.className = j===indent-1 ? 'join' : 'indent';
			}
			var icon = document.createElement('span');
			icon.className = 'file';
			line.appendChild(icon);
			if(data[i].children){
				var hit = document.createElement('span');
				line.appendChild(hit);
				hit.className  = 'hit';
				icon.className = 'folder';
				createTree(data[i].children, deep+1, li, deepest_ul, true);
			}else{
				deepest_ul.push(ul);
			}
			if(options.checkbox){
				var checkbox = document.createElement('span');
				checkbox.className = 'checkbox' + (data[i].checked ? ' checkbox-all' : '');
				line.appendChild(checkbox);
			}
			line.appendChild(name);
			name.appendChild(document.createTextNode(data[i].name));
			name.className = 'title';
		}
		container.appendChild(ul);
	};
	handler.prototype = {
		init: function(box, options){
			var that = this;
			var document = window.document;
			['Height', 'Width'].forEach(function(one){
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
			var deepest_ul = [];
			createTree(options.data, 1, box, deepest_ul);
			var w = $(box.children[0]);
			var $box = $(box);
			$box.addClass('tree-container');
			this.userOptions = options;
			this.container   = $box.get(0);
			this.contents    = w.get(0);
			$(this.contents).delegate('a', {
				contextmenu: function(e){
					if(that.userOptions.onContextmenu)
						return that.userOptions.onContextmenu.bind(this)(e);
				},
				click: function(e){
					if(!that.isLeaf(this)){
						that.toggle(this);
					}else{
						$(that.currentElement).removeClass('current');
						that.currentElement = this;
						$(this).addClass('current');
					}
					return that.userOptions.onClick.bind(this)(e);
				}
			});
			// checkbox {{{
			if(options.checkbox){
				// check {{{
				var check = {
					updateChildCheckState: function(ul, checked){
						if(!ul) return;
						var lis = ul.children;
						var len = lis.length;
						if(!lis || !len--) return;
						for(var i=0; i<=len; i++){
							var li = lis[i];
							var line = li.children[0];
							var $checkbox = $('.checkbox', line);
							$checkbox.get(0).className = 'checkbox';
							if(checked){
								$checkbox.addClass('checkbox-all');
							}
							line.option.checked = checked;
							check.updateChildCheckState(li.children[1], checked);
						}
					},
					updateParentCheckState: function(ul){
						if(!ul) return;
						if(ul.getAttribute('data-deep')<2) return;
						if(ul.nodeName.toLowerCase()!=='ul') return;
						var outer_li = ul.parentNode;
						var len = ul.children.length;
						var checked_len = $('>li>a>.checkbox-all', ul).length;
						var checkbox = $('.checkbox', outer_li).get(0);
						if(checked_len && checked_len===len){
							checkbox.className = 'checkbox checkbox-all';
						}else{
							var some_len = $('>li>a>.checkbox-some', ul).length;
							if(some_len || checked_len){
								checkbox.className = 'checkbox checkbox-some';
							}else{
								checkbox.className = 'checkbox';
							}
						}
						check.updateParentCheckState(outer_li.parentNode);
					}
				};
				// }}}
				$(this.contents).delegate('.checkbox', {
					click: function(){
						var line = this.parentNode;
						var li = line.parentNode;
						check.updateChildCheckState({children:[li]}, !line.option.checked);
						if(line.parentNode.parentNode.getAttribute('data-deep')>1){
							check.updateParentCheckState(li.parentNode);
						}
						return false;
					}
				});
				$.each(deepest_ul, function(i, one){
					check.updateParentCheckState(one);
				});
			}
			// }}}
			// dnd {{{
			if(options.dnd){
				var drag = {
					updatePosition: function(e){
						$(that.dragingProxyElement).css({top:e.pageY, left:e.pageX+25});
					},
					// drag start {{{
					start: function(){
						$(document).on({
							mousemove : drag.move,
							mouseup   : drag.end
						});
					},
					// }}}
					// drag move {{{
					move: function(e){
						that.disableSelection();
						if(that.dragingProxyElement.style.display!=='block')
							that.dragingProxyElement.style.display = 'block';
						drag.updatePosition(e);
						var pointElement = document.elementFromPoint(e.pageX, e.pageY);
						var line;
						drag.dropPosition = null;
						if(!pointElement) return;
						if($(pointElement).hasClass('line')){
							line = pointElement;
						}else if($(pointElement.parentNode).hasClass('line')){
							line = pointElement.parentNode;
						}
						if(drag.prevLine) $(drag.prevLine).css({border:'',boxSizing:''});
						if( line &&
							line!=that.dragingElement &&
							!$.contains(that.dragingElement.parentNode, line) ){
							var ht = line.offsetHeight,
								$line = $(line),
								pos = $line.position();
							drag.prevLine = line;
							$line.css({border:'none'});
							if(e.pageY-pos.top<5){
								$line.css({borderTop:'1px dotted red',boxSizing:'border-box'});
								drag.dropPosition = 'before';
							}else if(ht+pos.top-e.pageY<5){
								$line.css({borderBottom:'1px dotted red',boxSizing:'border-box'});
								drag.dropPosition = 'after';
							}else{
								if(that.isLeaf(line)) return;
								$line.css({border:'1px dotted red',boxSizing:'border-box'});
								drag.dropPosition = 'append';
							}
						}
					},
					// }}}
					updateChildrenIndext: function(ul, gap){//{{{
						if(!ul) return;
						var real_ul;
						if(!ul.nodeName || ul.nodeType) real_ul = ul.children[0].parentNode;
						else real_ul = ul;
						real_ul.setAttribute(
							'data-deep',
							Number(real_ul.parentNode.parentNode.getAttribute('data-deep')) + 1
						);
						var lis = ul.children,
							len = ul.children.length,
							_gap = gap;
						if(!lis || !len--) return;
						var indent = document.createElement('span');
						indent.className = 'indent';
						for(var i=0; i<=len; i++){
							var li = lis[i];
							var line = li.children[0];
							_gap = gap;
							if(_gap>=0){
								if(drag.dropPosition=='append') _gap++;
								while(_gap--){
									line.insertBefore(indent.cloneNode(true), line.children[0]);
								}
							}else{
								_gap = -_gap;
								if(drag.dropPosition=='append') _gap--;
								while(_gap--){
									line.removeChild(line.children[_gap]);
								}
							}
							drag.updateChildrenIndext(line.nextSibling, gap);
						}
					},//}}}
					end: function(){//{{{
						$(that.dragingProxyElement).hide();
						$(drag.prevLine).css({border:'none'});
						$(document).off({
							mousemove:drag.move,
							mouseup:drag.end
						});
						if(drag.dropPosition){
							if(options.onBeforeDrop){
								var tag = options.onBeforeDrop.bind(that)(drag.prevLine, that.dragingElement, drag.dropPosition);
								if(tag===false) return;
							}
							var sli = that.dragingElement.parentNode,
								tli = drag.prevLine.parentNode;
							var sul = sli.parentNode;
							var gap = tli.parentNode.getAttribute('data-deep')-sli.parentNode.getAttribute('data-deep');
							var sindex = $(sli).index();
							var spoption = that.getParentNode(sli).option.children;
							var soption = spoption[sindex];
							spoption.splice(sindex, 1);
							if(drag.dropPosition==='append'){
								if(that.isLeaf(drag.prevLine)) return;
								drag.prevLine.nextSibling.appendChild(sli);
								drag.prevLine.option.children.push(soption);
								// console.log(tli.children[0].option);
							}else{
								var to_index;
								if(tli.parentNode===sli.parentNode){
									to_index = $(tli).index()-($(tli).index()>sindex)+(drag.dropPosition==='after');
									that.getParentNode(tli).option.children.splice(to_index, 0, soption);
								}else{
									to_index = $(tli).index()+(drag.dropPosition==='after');
									that.getParentNode(tli).option.children.splice(to_index, 0, soption);
								}
								$(tli)[drag.dropPosition](sli);
								// console.log(that.getParentNode(tli).option);
							}
							drag.updateChildrenIndext({children:[sli]}, gap);
							drag.dropPosition = null;
							if(options.checkbox){
								if(sli) check.updateParentCheckState(sli.parentNode);
								if(sul) check.updateParentCheckState(sul);
								if(tli) check.updateParentCheckState(tli.parentNode);
							}
							if(options.onDrop){
								options.onDrop.bind(that)(drag.prevLine, that.dragingElement, drag.dropPosition);
							}
						}
					}//}}}
				};
				if(/Chrome/.test(navigator.userAgent)){ // Chrome draging hover state fixed {{{
					$(this.contents).delegate('a', {
						mouseenter: function(){
							$(this).addClass('hover');
						},
						mouseleave: function(){
							$(this).removeClass('hover');
						}
					});
				} // }}}
				$(this.contents).delegate('a', {
					mousedown: function(e){
						that.dragingElement = this;
						if(!that.dragingProxyElement){
							that.dragingProxyElement = document.createElement('div');
							document.body.appendChild(that.dragingProxyElement);
							$(that.dragingProxyElement).addClass('tree-draging-proxy');
						}
						$(that.dragingProxyElement).html(that.dragingElement.option.name);
						drag.updatePosition(e);
						drag.start();
						return false;
					}
				});
			}
			// }}}
		},
		getParentNode: function(node){
			var parentNode = null;
			try{
				parentNode = node.parentNode.parentNode.children[0];
			}catch(e){}
			return parentNode;
		},
		disableSelection: function(){
			if(window.getSelection){
				window.getSelection().removeAllRanges();
			}else if(document.selection){
				document.selection.empty();
			}
		},
		isLeaf: function(node){
			return !node.option.children;
		},
		toggle: function(folder){
			this[$(folder.nextSibling).is(':visible')?'collapse':'expand'](folder);
			return this;
		},
		expand: function(folder){
			var method = 'show';
			$(folder.parentNode).addClass('expanded').find('>a>.hit').addClass('hit-open');
			$(folder.nextSibling)[method](this.userOptions.animate.time);
			// this.contents.style.width = this.container.scrollWidth + 'px';
			return this;
		},
		collapse: function(folder){
			var method = 'hide';
			$(folder.parentNode).removeClass('expanded').find('>a>.hit').removeClass('hit-open');
			$(folder.nextSibling)[method](this.userOptions.animate.time);
			// this.contents.style.width = this.container.scrollWidth + 'px';
			return this;
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		var $this = $(this);
		var instance = handler(this, $.extend(true, {}, options));
		var ui = $this.data('ui');
		if(ui) ui.iTree = instance;
		else $this.data('ui', {iTree:instance});
	});
};
