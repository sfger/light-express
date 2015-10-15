var express = require('express');
var path    = require('path');
var fs      = require('fs');
var router  = express.Router();

var dir = 'demos/';
var ctrl = dir + 'index';
router.get(['/demos/index', '/demos/', '/demos'], function(req, res) {
	var view = path.normalize(dir + req.query.view);
	var view_path = path.normalize(process.cwd() + '/views/' + view + '.ejs');
	fs.exists(view_path, function(exists){
		if(exists){
			res.render(view, {
				dir:dir,
				dist:req.query.dist,
				___: req.query.dist == 1 ? view.replace(/\\/g, '/').replace(/[^\/]+/g, '..') : '',
				node: {
					placeholder:{
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
			}, express.UserConfig.dist.bind({req:req, res:res, distPath:view}));
		}else{
			res.writeHead(404, {"Content-Type": 'Not Found'});
			res.end('<h1>404 Not Found<h1>');
		}
	});
});

module.exports = router;
