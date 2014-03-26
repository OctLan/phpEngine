var TEMP = {};
TEMP.MESSAGE = '<div class="FB_boxBg"><table cellspacing="0" cellpadding="0" border="0"><tbody><tr><td><div class="content okBg">{message}</div></td></tr></tbody></table></div>';
//normal function for apps 

function afterAjax(res) {
	var error = false;
	var showAjaxMessage = function(res) {
			res = res.replace(/<message type="([\s\S]+?)">([\s\S]+?)<\/message>/, function(message) {
				if (showMessage && arguments.length > 2) {
					if (arguments[1] == 'error') {
						error = true;
					}
					showMessage(arguments[2], arguments[1]);
				}
				return '';
			});
			return res;
		}
	if (typeof(res) == 'string' && res) {
		res = showAjaxMessage(res);
	} else if (typeof(res) == 'object' && typeof(res.message) == 'string' && res.message) {
		showAjaxMessage(res.message);
	}
	if (error) {
		return false;
	} else {
		return res;
	}
}

function showMessage(message) {
	var res = {};
	res.message = message;
	if (arguments.length >= 2) {
		res.type = arguments[1];
	} else {
		res.type = 'notice';
	}
	res = $(res).substitute(TEMP.MESSAGE);
	if ($('#js_message').length > 0 && $('#js_message').get(0).messageAuto) {
		clearTimeout($('#js_message').get(0).messageAuto);
	}
	var messageBox = popBox(res, 'js_message', 999);
	$('#js_message').css('z-index', 999);
	$('#js_message').get(0).messageAuto = setTimeout(function() {
		$('#js_message').hide();
	}, 3000);
}

function popBox(res, id) {
	if (typeof(id) == 'string') {
		if (typeof(res) != 'object' && $(res).length == 0) {
			res = $('<div>' + res + '</div>');
		} else {
			res = $(res);
		}
		if (res.length > 0) {
			var box = $('#' + id);
			if (box.length < 1) {
				box = $('<div id="' + id + '"></div>');
				box.appendTo("body");
				if (res.find('.close').length > 0) {
					$('#' + id).on('click', '.close', function() {
						$('#' + id).hide();
					});
				}
			} else {
				box.html('');
			}
			box.show();
			if (arguments.length > 2 && parseInt(arguments[2], 10) > 0) {
				res.appendTo(box).pop(arguments[2]);
			} else {
				res.appendTo(box).pop();
			}
			//box.children().not(res).remove();
			autoEvent('#' + id);
			return res.parent();
		}
	}
}

function forceInt(obj) {
	var oldVal = $(obj).val();
	var newVal = $(obj).val().replace(/[^\d\.]/g, '').replace(/\..*/, '').replace(/^0+/, '0').replace(/^0*([1-9])/, '$1');
	if (newVal != oldVal) $(obj).val(newVal);
}

function forceFloat(obj) {
	var oldVal = $(obj).val();
	var newVal = $(obj).val().replace(/[^\d\.]/g, '');
	newVal = newVal.match(/\d*\.*\d{0,2}/)[0];
	newVal = newVal.replace(/\.+/g, '.').replace(/^\./, '0.').replace(/^0+/, '0').replace(/^0*([1-9])/, '$1');
	if (newVal != oldVal) $(obj).val(newVal);
}

function selectAll(obj, name) {
	if ($(obj).attr('checked') && name) {
		$(document).find(':checkbox[name*=' + name + ']').each(function() {
			if (!$(this).attr('checked')) {
				$(this).attr('checked', 'checked');
			}
		});
		return true;
	} else if (name) {
		$(document).find(':checkbox[name*=' + name + ']').each(function() {
			if ($(this).attr('checked')) {
				$(this).attr('checked', false);
			}
		});
		return false;
	}
}

function jConfirm(target, text) {
	var type = 'click';
	var $target = $(target);
	var saveHandlers = function() {
			var events = $.data(target, 'events');
			if (target.href) {
				// No handlers but we have href
				var url = target.href;
				$target.bind('click', function() {
					window.location.href = url;
				});
				target.href = 'javascript:void(0)';
				events = $.data(target, 'events');
			} else if (!events) {
				// There are no handlers to save.
				return;
			}
			target._handlers = new Array();
			for (var i in events[type]) {
				target._handlers.push(events[type][i]);
			}
		}
	var handler = function() {
			var text = $(this).attr('confirm');
			if (!text) {
				text = '确认进行此操作吗？';
			}
			var html = '<div class="W_layer" style="z-index:900">' + '<div class="bg">' + '<table cellspacing="0" cellpadding="0" border="0">' + '<tbody>' + '<tr>' + '<td>' + '<div class="content layer_mini_info">' + '<p class="clearfix">' + '<span class="icon_ask"></span>' + text + '</p>' + '<p class="btn">' + '<a class="btn_b yes" href="javascript:void(0)">' + '<span>??</span>' + '</a>' + '<a class="btn_d ml5 no" href="javascript:void(0)">' + '<span>??</span>' + '</a>' + '</p>' + '</div>' + '</td>' + '</tr>' + '</tbody>' + '</table>' + '</div>' + '</div>';
			// show confirm box
			var $box = $('#confirmBox');
			if ($box.length == 0) {
				$box = $('<div id="confirmBox" class="pa" style="position:absolute;overflow:hidden"><div class="confirmMask"></div><div class="confirmBody"></div></div>');
				$box.appendTo("body");
			} else {
				$box.html('');
				$box.html('<div class="confirmMask"></div><div class="confirmBody"></div>');
			}
			$box.show();
			var height = 95;
			var width = 200;
			var rect = this.getBoundingClientRect();
			var sizeObj = $(this).getObjSize();
			var newLeft = parseInt(rect.left + $(document).scrollLeft(), 10) + parseInt((sizeObj.width - width) / 2, 10);
			if (newLeft + width > $(document).width()) {
				newLeft = $(document).width() - width;
			}
			$box.css("top", parseInt(rect.top + $(document).scrollTop(), 10) - height + "px").css("left", newLeft + "px");
			$box.css({
				'width': width + 'px',
				'height': height + 'px'
			});
			$('#confirmBox .confirmMask').css({
				'width': width + 'px',
				'height': height + 'px'
			});
			$('#confirmBox .confirmMask').show();
			$('#confirmBox .confirmBody').html(html);
			$('#confirmBox .confirmMask').slideUp('normal');
			$('#confirmBox .confirmBody .yes').click(function() {
				if (target._handlers != undefined) {
					$.each(target._handlers, function() {
						$target.click(this.handler);
					});
				}
				// Trigger click event.
				$target.click();
				$target.unbind(type);
				$('#confirmBox .confirmMask').slideDown('normal', function() {
					$target.one(type, handler);
					$('#confirmBox').hide();
				});
			});
			$('#confirmBox .confirmBody .no').click(function() {
				$('#confirmBox .confirmMask').slideDown('normal', function() {
					$('#confirmBox').hide();
					$target.one(type, handler);
				});
			});
			return false;
		};
	saveHandlers();
	$target.unbind(type);
	$target.one('click', handler);
}

function textCount(obj) {
	if (!$(obj).attr('textCount')) {
		return true;
	} else {
		var noticeDiv = false;
		$(obj).parents('div').each(function() {
			if (noticeDiv == false && $(this).find('.textCountTip').length > 0) {
				noticeDiv = $(this).find('.textCountTip');
				return false;
			}
		});
		var count = $.trim($(obj).val()).length;
		var limit = parseInt($(obj).attr('textCount'), 10);
		if (limit >= count) {
			if ($(obj).hasClass('wrongInput')) {
				$(obj).removeClass('wrongInput');
			}
			noticeDiv.html('您还能输入<em>' + (limit - count) + '</em>个字');
			return true;
		} else {
			if (!$(obj).hasClass('wrongInput')) {
				$(obj).addClass('wrongInput');
			}
			noticeDiv.html('已超过<em class="red">' + (count - limit) + '</em>个字');
			return false;
		}
	}
}

function ajaxBox(url) {
	var data = {};
	if (arguments.length > 1) {
		data = arguments[1];
	}
	$.post(url, data, function(res) {
		if (res) {
			popBox(res, 'js_ajaxBox', 500).addMask( document , 0.5, 250 );
			if ($("#js_ajaxBox .Move").length >= 1) {
				var size = $("#js_ajaxBox").getObjSize();
				var left = $(document).width() - size.width;
				var top = $(document).height() - size.height;
				$("#js_ajaxBox").children(':first').Drags({
					handler: '.Move',
					area: [0, 0, left, top],
					zIndex: 200
				});
			}
			return false;
		} else {
			$('#js_ajaxBox').hide().html('');
			return false;
		}
	});
}

function autoEvent() {
	var objs;
	if (arguments.length > 0) {
		objs = $(arguments[0]).find('[action-type],[confirm],[hoverTip],[urlToAjax],[textCount]');
	} else {
		objs = $('[action-type],[confirm],[hoverTip],[urlToAjax],[textCount]');
	}
	if (objs.not('[switch]').length > 0) {
		objs.not('[switch]').bind('click', function() {
			if ($(this).attr('action-type') == 'ajaxBox') {
				if ($(this).attr('action-data')) {
					ajaxBox($(this).attr('action-data'));
				}
			} else if ($(this).attr('action-type') == 'fun') {
				if ($(this).attr('action-data')) {
					var fn = window[$(this).attr('action-data')];
					if (typeof(fn) == 'function') {
						fn(this);
					}
				}
			} else if ($(this).attr('action-type') == 'selectAll') {
				if ($(this).attr('action-data')) {
					var name = $(this).attr('action-data');
					if (select_all(this, name)) {
						$('[action-type=selectAll]').filter('[action-data=' + name + ']').attr('checked', true);
					} else {
						$('[action-type=selectAll]').filter('[action-data=' + name + ']').attr('checked', false);
					}
				}
			}
		});
		//check if has selectAll 
		var names = {};
		objs.filter('[action-type=selectAll]').each(function() {
			var obj = this;
			var name = $(this).attr('action-data');
			if (name && names[name] != true) {
				$(':checkbox[name*=' + name + ']').live('click', function() {
					if ($(':checkbox[name*=' + name + ']:checked').length != $(':checkbox[name*=' + name + ']').length) {
						$('[action-type=selectAll]').filter('[action-data=' + name + ']').attr('checked', false);
					} else {
						$('[action-type=selectAll]').filter('[action-data=' + name + ']').attr('checked', true);
					}
				});
				names[name] = true;
			}
		});
		//check if has confirm
		objs.filter('[confirm]').each(function() {
			if (typeof($(this).attr('confirm')) != 'undefined') {
				jConfirm(this, $(this).attr('confirm'));
			}
		});
	}
	objs.filter('[hoverTip]').hover(

	function() {
		$($(this).attr('hoverTip')).show();
	}, function() {
		$($(this).attr('hoverTip')).hide();
	});
	objs.filter('[urlToAjax]').each(function() {
		var fn = window[$(this).attr('urlToAjax')];
		if (typeof(fn) == 'function') {
			$(this).find('a').each(function() {
				var url = $(this).attr('href');
				if (url && url != '#' && url.substr(0, 11).toLowerCase() != 'javascript:') {
					$(this).attr('href', 'javascript:void(0)');
					$(this).bind('click', function() {
						fn(this, url);
					});
				}
			});
		}
	});
	objs.filter('[textCount]').each(function() {
		textCount(this);
		$(this).bind('propertychange', function(e) {
			e.preventDefault();
			textCount(this);
		}).bind("input", function() {
			textCount(this);
		});
	});
}
//(function($) {
$.extend($.fn, {
	getCss: function(key) {
		var v = parseInt(this.css(key));
		if (isNaN(v)) return false;
		return v;
	}
});
$.fn.Drags = function(opts) {
	var ps = $.extend({
		zIndex: 20,
		opacity: .7,
		handler: null,
		area: null,
		onMove: function() {},
		onDrop: function() {}
	}, opts);
	var dragndrop = {
		drag: function(e) {
			var dragData = e.data.dragData;
			var left = dragData.left + e.pageX - dragData.offLeft;
			var top = dragData.top + e.pageY - dragData.offTop;
			if (dragData.area) {
				left = Math.min(Math.max(dragData.area[0], left), dragData.area[2]);
				top = Math.min(Math.max(dragData.area[1], top), dragData.area[3]);
			}
			//left = Math.min( Math.max( 0 , left ) , ps.maxLeft );
			//top = Math.min( Math.max( 0 , top ) , ps.maxTop );
			dragData.target.css({
				left: left,
				top: top
			});
			dragData.handler.css({
				cursor: 'move'
			});
			dragData.onMove(e);
			e = e || window.event;
			if (e.stopProgation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		},
		drop: function(e) {
			var dragData = e.data.dragData;
			dragData.target.css(dragData.oldCss); //.css({ 'opacity': '' });
			//dragData.handler.css('cursor', dragData.oldCss.cursor);
			dragData.onDrop(e);
			$(document).unbind('mousemove', dragndrop.drag).unbind('mouseup', dragndrop.drop);
		}
	}
	return this.each(function() {
		var me = this;
		var handler = null;
		if (typeof ps.handler == 'undefined' || ps.handler == null) handler = $(me);
		else handler = (typeof ps.handler == 'string' ? $(ps.handler, this) : ps.handle);
		handler.bind('mousedown', {
			e: me
		}, function(s) {
			var target = $(s.data.e);
			var oldCss = {};
			if (target.css('position') != 'absolute') {
				try {
					target.position(oldCss);
				} catch (ex) {}
				target.css('position', 'absolute');
			}
			oldCss.cursor = target.css('cursor') || 'default';
			//oldCss.opacity = target.getCss('opacity') || 1;
			var dragData = {
				left: oldCss.left || target.getCss('left') || 0,
				top: oldCss.top || target.getCss('top') || 0,
				width: target.width() || target.getCss('width'),
				height: target.height() || target.getCss('height'),
				offLeft: s.pageX,
				offTop: s.pageY,
				oldCss: oldCss,
				area: ps.area,
				onMove: ps.onMove,
				onDrop: ps.onDrop,
				handler: handler,
				target: target
			}
			//target.css('opacity', ps.opacity);
			$(document).bind('mousemove', {
				dragData: dragData
			}, dragndrop.drag).bind('mouseup', {
				dragData: dragData
			}, dragndrop.drop);
		});
	});
}
//})(jQuery); 
$(function() {
	autoEvent();
});
//add on
(function($, afterAjax) {
	var inIframe = true;
	var ajaxLock = {};
	var lastTargetInfo = false;
	var getEvent = function() {
			if (document.all) return window.event;
			func = getEvent.caller;
			while (func != null && func.arguments) {
				var arg0 = func.arguments[0];
				if (arg0) {
					if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
						return arg0;
					}
				}
				func = func.caller;
			}
			return null;
		}
	var getlastObj = function() {
			var event = getEvent();
			if (event) {
				var elem = event.srcElement || event.target;
				if (elem && typeof(elem.nodeType) != undefined && elem.nodeType) {
					return elem;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	var originalAjax = $.ajax;
	$.ajax = function() {
		if (arguments.length > 0) {
			var url = arguments[0].url;
			if (ajaxLock[url] == true) {
				return;
			}
			var originalSuccess = function() {};
			var cleanLock = function() {
					ajaxLock[url] = false;
				};
			if (arguments[0].success) {
				originalSuccess = arguments[0].success;
			}
			if (inIframe) {
				var elem = getlastObj();
				if (elem && elem != document) {
					lastTargetInfo = {};
					lastTargetInfo.isLastTarget = true;
					lastTargetInfo.rect = elem.getBoundingClientRect();
					lastTargetInfo.size = $(elem).getObjSize();
				}
			}
			arguments[0].success = function(res) {
				cleanLock();
				if (afterAjax && typeof(afterAjax) == 'function') {
					res = afterAjax(res, lastTargetInfo);
				}
				if (res !== false) originalSuccess(res, lastTargetInfo);
			}
			ajaxLock[url] = true;
			return originalAjax.apply(this, arguments);
		}
	};
	$.fn.getObjSize = function() {
		var size = {
			'width': 0,
			'height': 0,
			'top': 0,
			'left': 0
		};
		var level = 5;
		var obj = this;
		while (obj.outerHeight() == 0 && obj.length > 0 && level > 0) {
			if (arguments.length == 1) {
				obj = obj.children().find(arguments[0]);
			} else {
				obj = obj.children(':first');
			}
			level = level - 1;
		}
		size.width = obj.outerWidth();
		size.height = obj.outerHeight();
		return size;
	};
	$.fn.getObjSize = function() {
		var size = {
			'width': 0,
			'height': 0,
			'top': 0,
			'left': 0
		};
		var level = 5;
		var obj = this;
		while (obj.outerHeight() == 0 && obj.length > 0 && level > 0) {
			if (arguments.length == 1) {
				obj = obj.children().find(arguments[0]);
			} else {
				obj = obj.children(':first');
			}
			level = level - 1;
		}
		size.width = obj.outerWidth();
		size.height = obj.outerHeight();
		return size;
	};
	$.fn.pop = function() {
		var size = this.getObjSize();
		if (this.css('position') != 'absolute') {
			this.css('position','absolute');
		}
		if (($(window).height() - size.height) / 2 + $(window).scrollTop() < 0) {
			this.css("top", "0px");
		} else {
			if (inIframe) {
				var rect, rectSize;
				var elem = getlastObj();
				if (elem == false) {
					var func = arguments.callee.caller;
					do {
						if (func.arguments && func.arguments.length == 2 && func.arguments[1].isLastTarget != undefined) {
							var lastTarget = func.arguments[1];
							rect = lastTarget.rect;
							rectSize = lastTarget.size;
							break;
						}
						func = func.caller;
					} while (func);
					if (!func && lastTargetInfo) {
						rect = lastTargetInfo.rect;
						rectSize = lastTargetInfo.size;
					}
				} else {
					rect = elem.getBoundingClientRect();
					rectSize = $(elem).getObjSize();
				}
				if (!rect || !rectSize) {
					this.css("top", "50px");
				} else if (!$(elem).is($(this))) {
					var mY = parseInt(rect.top, 10) + rectSize.height / 2 + $(document).scrollTop() - size.height / 2;
					if (mY + size.height > $(window).height() + $(window).scrollTop()) {
						mY = $(window).scrollTop() + $(window).height() - size.height;
					}
					if (mY < 0) {
						mY = 0;
					}
					this.css("top", mY + "px");
				}
			} else {
				this.css("top", ($(window).height() - size.height) / 2 + $(window).scrollTop() + "px");
			}
		}
		this.css("left", ($(window).width() - size.width) / 2 + $(window).scrollLeft() + "px");
		if (arguments.length > 0 && parseInt(arguments[0], 10) > 0) {
			this.css('z-index', parseInt(arguments[0], 10));
		}
		if ($(this).find('.js_maskIframe').length == 0 && $.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
			if ($(document).find('select').length > 0) {
				$(this).wrapInner('<div style="position:relative;width:' + size.width + 'px;height:' + size.height + 'px;" class="maskDiv"></div>');
				$('.maskDiv').before('<iframe class="js_maskIframe" style="position:absolute;z-index:-1;width:' + size.width + 'px;height:' + size.height + 'px;top:' + size.top + 'px;left:' + size.left + 'px;" frameBorder=0 ></iframe>');
			}
		}
		return this;
	};
	$.fn.blink = function() {
		var o = {};
		var $target = this;
		var id = $(this).attr('id') || $(this).attr('name');
		o[id] = {};
		o[id].begin = 0;
		o[id].end = 0;
		o[id].lock = false;
		o[id].step = 6;
		o[id].times = 6;
		o[id].color = function(i) {
			$target.css('background', 'rgb(255,' + i + ',' + i + ')');
		}
		o[id].color_next = function(f) {
			if (o[id].begin > o[id].end) {
				o[id].begin -= o[id].step;
			} else if (o[id].begin < o[id].end) {
				o[id].begin += o[id].step;
			} else {
				o[id].lock = false;
				if (typeof(f) == 'function') {
					f();
				}
				return;
			}
			o[id].color(o[id].begin);
			setTimeout(function() {
				o[id].color_next(f);
			}, 25);
		}
		o[id].color_to = function(x, y, f) {
			if (o[id].lock) {
				return;
			}
			o[id].begin = x;
			o[id].end = y;
			o[id].lock = true;
			o[id].color_next(f);
		}
		var _c = 255 - o[id].step * o[id].times;
		o[id].color_to(255, _c, function() {
			o[id].color_to(_c, 255, function() {
				o[id].color_to(255, _c, function() {
					o[id].color_to(_c, 255);
				});
			});
		});
		return this;
	};
	$.fn.substitute = function(str) {
		var obj = this[0];
		if (!(Object.prototype.toString.call(str) === '[object String]')) {
			return '';
		}
		if (!(Object.prototype.toString.call(obj) === '[object Object]' && 'isPrototypeOf' in obj)) {
			return str;
		}
		return str.replace(/\{([^{}]+)\}/g, function(match, key) {
			var value = obj[key];
			return (value !== undefined) ? '' + value : '';
		});
	};
	$.fn.setValue = function(json) {
		if (typeof(json) == 'string' && arguments.length == 2) {
			var key = json;
			json = {};
			json[key] = arguments[1];
		}
		var _this = this;
		var jsonNameFormat = function( json ){
			var prefix = '' , jsonFormated = {};
			if( arguments[1] ){
				prefix = arguments[1]; 
			}
			$.each(json, function(name , value ){
				name = prefix?prefix+'['+name+']':name;
				if( typeof(value) == 'object' ){
					//alert(name);
					jsonFormated = $.extend( jsonFormated ,  jsonNameFormat( value , name ) );
				}else{
					jsonFormated[name] = value;
				}
			});
			return jsonFormated;
		};
		if (typeof(json) == 'object') {
			json = jsonNameFormat( json );
			$.each(json, function(name, value) {
				var obj = $(_this).find(":input[name='" + name + "']");
				if (obj.length > 0) {
					switch (obj.get(0).type) {
					case 'radio':
					case 'checkbox':
						obj.filter("[value='" + value + "']").filter(":not(:checked)").click();
						break;
					case 'select-one':
					case 'textarea':
					case 'text':
					case 'hidden':
						obj.val(value);
						break;
					}
				}
			});
		}
		return this;
	};
	$.fn.addMask = function( obj , opacity, zindex) {
		var newCss = {};
		newCss.width = $(obj).width() + 'px';
		newCss.height = $(obj).height() + 'px';
		newCss.position = 'absolute';
		newCss['-moz-opacity'] = opacity;
		newCss.opacity = opacity;
		newCss['z-index'] = zindex;
		newCss.filter = 'alpha(Opacity=' + parseFloat(opacity, 10) * 100 + ')';
		if (arguments.length > 3) {
			if (arguments[3]) {
				newCss.background = arguments[3];
			}
		} else {
			newCss.background = '#777';
		}
		if( obj == document ){
			newCss.top = '0px';
			newCss.left = '0px';
		}else{
			var rect = $(obj).get(0).getBoundingClientRect();
			newCss.top = rect.top + 'px';
			newCss.left = rect.left + 'px';
		}
		var className;
		if (arguments.length > 3) {
			className = arguments[3];
		} else {
			className = 'js-mask';
		}
		var maskDiv = $('<div></div>');
		maskDiv.addClass(className);
		maskDiv.css(newCss);
		maskDiv.appendTo(this);
		return this;
	};
})(jQuery, afterAjax);