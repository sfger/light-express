$.fn.window = function (options) {
  var type = $.type(options);
  if (type === "string") {
    this.each(function () {
      var ui = $(this).data("ui");
      if (ui && ui.iWindow) {
        ui.iWindow[options]();
      } else {
        throw new Error("UI:window does not init...");
      }
    });
    return true;
  }
  options = $.extend(
    true,
    {
      title: "",
      show: false,
      footer: {},
    },
    options
  );
  var handler = function (box, options) {
    return new handler.prototype.init(box, options);
  };
  handler.prototype = {
    init: function (box, options) {
      var that = this;
      var $box = $(box);
      var footer = options.footer.formatter
        ? '<div class="window-bar window-footer">' +
          options.footer.formatter() +
          "</div>"
        : "";
      var ctn =
        '<div class="window-ctn">' +
        '<div class="window-wrapper">' +
        '<div class="window-bar window-header">' +
        '<div class="window-title">' +
        (options.title || "") +
        "</div>" +
        '<a href="javascript:;" class="window-closer">&times;</a>' +
        '<!--[if lt IE 8]><p class="iecp"></p><![endif]-->' +
        "</div>" +
        '<div class="window-contents"></div>' +
        footer +
        "</div>" +
        '<!--[if lt IE 8]><p class="iecp"></p><![endif]-->' +
        "</div>";
      var w = $(ctn.replace(/(\/?>)\s+|\s+(?=<)/g, "$1")).appendTo(
        document.body
      );
      if (options["class"]) w.addClass(options["class"]);
      if (options.id) w.attr("id", options.id);
      this.userOptions = options;
      this.container = w.get(0);
      this.render = box;
      this.wraper = $(".window-wrapper", w).get(0);
      this.closer = $(".window-closer", w).get(0);
      this.contents = $(".window-contents", w).get(0);
      this.title = $(".window-title", w).html(options.title).get(0);
      $box.addClass("window-view").appendTo(this.contents).show();
      $(["Height", "Width"]).each(function (_i, one) {
        that["getView" + one] = (function () {
          var container =
            "BackCompat" === document.compatMode
              ? document.body
              : document.documentElement;
          return function () {
            return container["client" + one];
          };
        })();
        that["getElement" + one] = function (e) {
          if (!e || e.style.display === "none") return 0;
          return e["offset" + one];
        };
      });

      $(this.closer).on("click", function () {
        that.close();
        return false;
      });
      if (options.show) this.show();
      // var isIE6      = /MSIE 6.0/.exec(navigator.userAgent);
      // var css1compat = document.compatMode === "CSS1Compat";
      // if(isIE6 || !css1compat) $(window).resize(function(){that.resize();});
      if (options.onCreate && typeof options.onCreate === "function")
        options.onCreate();
    },
    resize: function () {
      var $container = $(this.container);
      if ($container.is(":visible")) {
        $container.css({
          width: this.getViewWidth(),
          height: this.getViewHeight(),
        });
      }
    },
    open: function () {
      this.show();
    }, // alias for show
    show: function () {
      // var html = document.documentElement;
      // var body = document.body;
      // body.style.width = body.offsetWidth + 'px';
      var $container = $(this.container);
      // var $contents  = $(this.contents);
      // var	wraper     = this.wraper;
      if ($container.is(":visible")) return false;

      var options = this.userOptions;
      if (options.onBeforeOpen) {
        if (!options.onBeforeOpen()) {
          return false;
        }
      }

      // $([html, body]).css({overflow:'hidden'});
      // $container.show();
      $container.fadeIn(150);
      var css1compat = document.compatMode === "CSS1Compat";
      var isIE6 = /MSIE 6.0/.exec(navigator.userAgent);
      // var isIE7      = /MSIE 7.0/.exec(navigator.userAgent);
      // if(isIE6 || isIE7 || document.documentMode<8){
      // 	var contentWidth = this.render.offsetWidth;
      // 	$(wraper).css({width:contentWidth});
      // }
      if (isIE6 || !css1compat) {
        $container.css({
          // width    : this.getViewWidth(),
          height: this.getViewHeight(),
          position: "absolute",
        });
        // $container.hide().show();
        $(window).on(
          "scroll.windowIE6",
          { el: this.container },
          this.scrollIE6
        );
        $(window).trigger("scroll.windowIE6");
      }
      if (options.onOpen) options.onOpen();
      return this;
    },
    scrollIE6: function (e) {
      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      $(e.data.el).css({ top: scrollTop });
    },
    close: function () {
      var options = this.userOptions;
      if (
        options.onBeforeClose &&
        typeof options.onClose === "function" &&
        !options.onBeforeClose()
      )
        return false;
      // document.body.style.width = '';
      // this.container.style.display = 'none';
      $(this.container).fadeOut(150);
      // $([document.documentElement, document.body]).css({overflow:''});
      $(window).off("scroll.windowIE6", this.scrollIE6);
      if (options.onClose && typeof options.onClose === "function")
        options.onClose();
      return this;
    },
  };
  handler.prototype.init.prototype = handler.prototype;
  return this.each(function () {
    var $this = $(this);
    var instance = handler(this, $.extend(true, {}, options));
    var ui = $this.data("ui");
    if (ui) ui.iWindow = instance;
    else $this.data("ui", { iWindow: instance });
  });
};
