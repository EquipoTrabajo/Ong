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

//Create a company
router.post('/company', function (req, res) {
	var body = req.body;
	Company.addPerson(body, function (err, company) {
		if(err){
			throw err;
		}
		res.json(company);
	});
});


//create a receiving entity
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

// Get Company
router.get('/company/:username', function (req, res) {
	Company.getCompanyByUsername(req.params.username, function (err, company) {
		if(err){
			throw err;
		}
		res.json(company);
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

// Get Nearby Campaigns
router.get('/Campaigns?nearby=:city', function (req, res) {
	Campaign.getNearbyCampaigns(req.params.city, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});


// Get Nearby Campaigns
router.get('/Campaigns/recommended', function (req, res) {
	var userid = '587e5703901ad433650db058'; //get user by session
	Campaign.getRecommendedCampaigns(userid, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});

module.exports = router;
