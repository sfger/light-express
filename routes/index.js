var express = require('express');
var libFs	= require('fs');
var router  = express.Router();
var path    = require('path');

router.get(['/*.html'], function(req, res, next){
	var app      = req.app;
	var url_path = req.path.slice(1, -5);
	if(!url_path) url_path = 'index';
	var view     = url_path.replace(/\/html\//, '/views/');
	var file     = path.join(app.get('views'), view) + '.ejs';

	file = path.normalize(file);
	libFs.exists(file, function(exists){
		if(!exists) return next();
		res.render(view, {
			___: '',
			node: {
				placeholder:{
					white:"/common/img/placeholder.png"
				},
				get_img: function(width, height, bg, color, text){
					var colorTrans = function(c){
						return c.replace(/./g, function(s){return s+s;});
					};
					height = height || width;
					bg     = bg     || 'ccc';
					color  = color  || '000';
					text   = text   || (width + 'X' + height);

					// return 'http://dummyimage.com/'+width+'x'+height+'/'+bg+'/'+color+'.png&text=' + text;
					// return 'http://fakeimg.pl/'+width+'x'+height+'/'+bg+'/'+color+'/?text=' + text;

					// 不支持三位颜色的，变换成六位
					if(bg.length==3) bg = colorTrans(bg);
					if(color.length==3) color = colorTrans(color);

					return 'http://fpoimg.com/'+width+'x'+height+'?bg_color='+bg+'&text_color='+color+'&text=' + text;
				}
			}
		}, express.UserConfig.dist.bind({req:req, res:res, distPath:url_path}));
	});
});

module.exports = router;
