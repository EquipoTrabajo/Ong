var express = require('express');

var router = express.Router();

router.get('/campaign', function (req, res) {
	res.render('add-campaign');
});

module.exports = router;