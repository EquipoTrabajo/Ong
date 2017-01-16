var express = require('express');
var router = express.Router();
var User = require('../app/model/user.js');
var Person = require('../app/model/person.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/person', function (req, res) {
	var user = new User({
		name: req.body.name,
		profile_picture: req.body.profile_picture,
		cover_picture: req.body.cover_picture,
		address: {
			city: req.body.city,
			state: req.body.state,
			country: req.body.country,
			coordinates: [req.body.cordx, req.body.cordy]
		},
		score: req.body.score,
		level: req.body.level
	});

	user.save(function (err) {
	  if (err) return err;
	  
	  var person = new Person({
	    userid: user._id,
		age: req.body.age,
		slogan: req.body.slogan
	  });
	  
	  person.save(function (err) {
	    if (err) return handleError(err);
	    // thats it!
	  });
	});
});

module.exports = router;
