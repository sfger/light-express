var express = require('express');
var router = express.Router();

var dir = '';
var path = dir + 'index';
router.get(['/' + path, '/'], function(req, res) {
	// console.log(res.app);
	// console.log(req.app);
	res.render(path, {
		title:req.session.views,
		dir:dir,
		path:path,
		___:req.query.dist == 1 ? path.replace(/[^\/]+/g, '..') : ''
	}, express.UserConfig.dist.bind({req:req, res:res}));
});

module.exports = router;
