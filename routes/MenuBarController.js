var router = require('express').Router();
var menuBar = require('../models/entities/MenuBar.js');

router.all('*',function(req,res,next){
	if(req.user)
		res.locals.menuBar = menuBar.user
	else
		res.locals.menuBar = menuBar.guest;
	
	next();
});

module.exports = router;