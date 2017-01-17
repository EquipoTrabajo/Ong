var express = require('express');
var router = express.Router();
var User = require('../app/model/user.js');
var Person = require('../app/model/person.js');
var Company = require('../app/model/company.js');
var ReceivingEntity = require('../app/model/receivingEntity.js');
var Campaign = require('../app/model/campaign.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//CREATE PERSON TO THE DATABASE
router.post('/person', function (req, res, next) {
	var person = req.body;
	Person.addPerson(person, function (err, person) {
		if(err){
			throw err;
		}
		res.json(person);
	});
});

router.post('/company', function (req, res) {
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
	  
	  var company = new Company({
	    userid: user._id,
		age: req.body.age,
		slogan: req.body.slogan,
		description: req.body.description
	  });
	  
	  company.save(function (err) {
	    if (err) return err;
	    // thats it!
	  });
	});
});

router.post('/receiving-entity', function (req, res) {
	var receivingEntity = req.body;
	ReceivingEntity.addReceivingEntity(receivingEntity, function (err, receivingEntity) {
		if(err){
			throw err;
		}
		res.json(receivingEntity);
	});
});

router.post('/campaign', function (req, res) {
	var campaign = req.body;
	Campaign.addCampaign(campaign, function (err, campaign) {
		if(err){
			throw err;
		}
		res.json(campaign);
	});
});

// just for testing stuffs
// Delete After
router.post('/testing', function (req, res) {
	var temp = req.body.g1;
	temp["g1f3"] = "v3";
	res.json(temp);
});


//GET'S

// Get User
router.get('/person/:username', function (req, res) {
	Person.getPersonByUsername(req.params.username, function (err, user) {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

// Get User
router.get('/person/:username', function (req, res) {
	Person.getPersonByUsername(req.params.username, function (err, user) {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

// Get Receiving Entity
router.get('/receiving-entity/:username', function (req, res) {
	ReceivingEntity.getRecievingEntityByUsername(req.params.username, function (err, user) {
		if(err){
			throw err;
		}
		res.json(user);
	});
});

// Get Receiving Entity
router.get('/Campaigns', function (req, res) {
	Campaign.getAllCampaigns(function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});

// Get Receiving Entity
router.get('/Campaigns?nearby=:city', function (req, res) {
	Campaign.getNearbyCampaigns(req.params.city, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});
module.exports = router;
