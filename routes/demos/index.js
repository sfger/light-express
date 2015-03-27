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
				___: req.query.dist == 1 ? view.replace(/\\/g, '/').replace(/[^\/]+/g, '..') : ''
			}, express.UserConfig.dist.bind({req:req, res:res, distPath:view}));
		}else{
			res.writeHead(404, {"Content-Type": 'Not Found'});
			res.end('<h1>404 Not Found<h1>');
		}
	});
});

module.exports = router;
