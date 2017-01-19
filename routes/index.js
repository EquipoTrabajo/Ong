var express = require('express');
var router = express.Router();
var User = require('../app/model/user.js');
var Person = require('../app/model/person.js');
var Company = require('../app/model/company.js');
var ReceivingEntity = require('../app/model/receivingEntity.js');
var Campaign = require('../app/model/campaign.js');
var Update = require('../app/model/update');
var Comment = require('../app/model/comment');


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
router.get('/campaigns/:id', function (req, res) {
	Campaign.getCampaignById(req.params.id, function (err, campaign) {
		if(err){
			throw err;
		}
		res.json(campaign);
	});
});

// Get Receiving Entity
router.get('/campaigns', function (req, res) {
	Campaign.getAllCampaigns(function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});

// Get Nearby Campaigns
router.get('/campaigns/nearby=:city', function (req, res) {
	Campaign.getNearbyCampaigns(req.params.city, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});


// Get recommended Campaigns
router.get('/campaigns/recommended', function (req, res) {
	var userid = req.headers.userid; //person id
	Campaign.getRecommendedCampaigns(userid, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});

// Get friends Campaigns
router.get('/campaigns/friends', function (req, res) {
	var userid = req.headers.userid; //person id
	Campaign.getFriendsDonatedCampaigns(userid, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	});
});

// Get category Campaigns
router.get('/campaigns/category/:category', function (req, res) {
	Campaign.getCampaignsByCategory(req.params.category, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	});
});

//like Campaign
router.get('/campaigns/:id/like', function (req, res) {
	var idUser = req.headers.userid; //person id
	Campaign.likeCampaign(req.params.id, idUser, function (err, campaign) {
		if(err){
			throw err;
		}
		res.json(campaign);
	});
});

//dislike Campaign
router.get('/campaigns/:id/dislike', function (req, res) {
	var idUser = req.headers.userid; //person id
	Campaign.dislikeCampaign(req.params.id, idUser, function (err, campaign) {
		if(err){
			throw err;
		}
		res.json(campaign);
	});
});

//Comment Campaign
router.post('/campaigns/:id/comment', function (req, res) {
	var idUser = req.headers.userid; //person id
	Comment.addComment(req.body.text, idUser, function (err, comment) {
		if(err){
			throw err;
		}
		Campaign.commentCampaign(req.params.id, comment._id, function (err, campaign) {
			if(err){
				throw err;
			}
			res.json(campaign);
		});
	});
});


//Add update to campaign
router.post('/campaigns/:id/update', function (req, res) {
	var update = req.body;
	Update.addUpdate(update, function (err, update) {
		if(err){
			throw err;
		}
		Campaign.addUpdate(req.params.id, update._id, function (err, campaign) {
			if(err){
				throw err;
			}
			res.json(campaign);
		});
	});
});

//Comment an update
router.post('/campaigns/:idCampaign/update/:idUpdate/comment', function (req, res) {
	var idUser = req.headers.userid; //person id
	Comment.addComment(req.body.text, idUser, function (err, comment) {
		if(err){
			throw err;
		}
		Update.commentUpdate(req.params.idUpdate, comment._id, function (err, update) {
			if(err){
				throw err;
			}
			res.json(update);
		});
	});
});


module.exports = router;
