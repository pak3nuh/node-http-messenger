var express = require('express');
var router = express.Router();
var su = require('../custom-node-modules/string-utils');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});


module.exports = router;
