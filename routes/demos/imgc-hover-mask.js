var express = require('express');
var router = express.Router();

var dir = 'demos/';
var path = dir + 'imgc-hover-mask';
router.get('/' + path, function(req, res) {
	res.render(path, {
		dir:dir,
		path:path,
		___: req.query.dist == 1 ? path.replace(/[^\/]+/g, '..') : ''
	}, express.UserConfig.dist.bind({req:req, res:res}));
});

module.exports = router;
