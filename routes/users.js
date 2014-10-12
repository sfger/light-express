var express = require('express');
var router = express.Router();
var dir = '';
var path = dir + 'users';
router.get('/' + path, function(req, res) {
	var n = req.session.views || 0;
	req.session.views = ++n;
	res.cookie('name', 'tester', {maxAge:600000, httpOnly:true, path:'/', secure:true});
	res.end(n + ' views');
	// res.render(path, {
	// 	title:'users',
	// 	dir:dir,
	// 	path:path,
	// 	___: req.query.dist == 1 ? path.replace(/[^\/]+/g, '..') : ''
	// }, express.UserConfig.dist.bind({req:req, res:res}));
});

module.exports = router;
