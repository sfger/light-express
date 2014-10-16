var express = require('express');
var router = express.Router();

var dir = 'demos/';
var ctrl = dir + 'index';
router.get('/' + ctrl, function(req, res) {
	var view = dir + req.query.view;
	// console.log(view);
	res.render(view, {
		dir:dir,
		___: req.query.dist == 1 ? view.replace(/[^\/]+/g, '..') : ''
	}, express.UserConfig.dist.bind({req:req, res:res, distPath:view}));
});

module.exports = router;
