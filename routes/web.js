var express = require('express');

var router = express.Router();

router.get('/campaign', function (req, res) {
	res.render('add-campaign');
});

router.get('/company', function (req, res) {
	res.render('add-company');
});

module.exports = router;