var express = require('express');
var router = express.Router();
var User = require('../app/model/user.js');
var Person = require('../app/model/person.js');
var Company = require('../app/model/company.js');
var ReceivingEntity = require('../app/model/receivingEntity.js');
var Campaign = require('../app/model/campaign.js');
var Update = require('../app/model/update');
var Comment = require('../app/model/comment');
var Review = require('../app/model/review');
var Acknowledgment = require('../app/model/acknowledgment');
var Activity = require('../app/model/activity');



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
	var idPerson = req.headers.usertypeid;
	body.company.admins = [];
	body.company.admins.push(idPerson);
	Company.addCompany(body, function (err, company) {
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
	var user = req.headers.userid;
	var campaign = req.body;
	campaign.creators = [];
	campaign.creators.push(user);
	Campaign.addCampaign(campaign, function (err, campaign) {
		if(err){
			throw err;
		}
		res.json(campaign);
	});
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


//get person activities

router.get('/person/:username', function (req, res) {
	Activity.getActivities(req.params.username, function (err, activities) {
		if(err){
			throw err;
		}
		res.json(activities);
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

//Make Admin
router.post('/company/:idCompany/person/:idPerson/add-admin', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Company.addAdmin(req.params.idCompany, req.params.idPerson, function (err, company) {
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
	var idPerson = req.headers.usertypeid;
	Campaign.getCampaignById(req.params.id, function (err, campaign) {
		if(err){
			throw err;
		}
		Person.addSeenCampaign(idPerson, req.params.id, function (err, person) {
			res.json(campaign);
		});
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
router.get('/campaigns/nearby/:city', function (req, res) {
	Campaign.getNearbyCampaigns(req.params.city, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	});
});


// Get recommended Campaigns
router.get('/campaigns/recommended/search', function (req, res) {
	var userid = req.headers.usertypeid; //person id
	Campaign.getRecommendedCampaigns(userid, function (err, campaigns) {
		if(err){
			throw err;
		}
		res.json(campaigns);
	}, 20);
});

// Get friends Campaigns
router.get('/campaigns/friends/search', function (req, res) {
	var userid = req.headers.usertypeid; //person id
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

//Get Acknowledgments
router.get('/acknowledgments', function (req, res) {
	Acknowledgment.getAcknowledgments(req.headers.usertypeid, function (err, acknowledgment) {
		if(err){
			throw err;
		}
		res.json(acknowledgment);
	});
});

//activate campaign
router.post('/campaigns/:id/validate', function (req, res) {
	var idUser = req.headers.usertypeid; //person id
	Campaign.validateCampaign(req.params.id, idUser, function (err, campaign) {
		if(err){
			throw err;
		}
		res.json(campaign);
	});
});

//like Campaign
router.post('/campaigns/:id/like', function (req, res) {
	var idUser = req.headers.usertypeid; //person id
	Campaign.likeCampaign(req.params.id, idUser, function (err, campaign) {
		if(err){
			throw err;
		}
		Person.update({ _id: idUser }, { $push: { liked_campaigns: req.params.id }}, function (err, person) {
			if(err){
				throw err;
			}
			Activity.addActity(idUser, req.params.id, 'likes', function (err) {
				if(err){
					throw err;
				}
				res.json(campaign);
			});
		});
	});
});

//dislike Campaign
router.post('/campaigns/:id/dislike', function (req, res) {
	var idUser = req.headers.usertypeid; //person id
	Campaign.dislikeCampaign(req.params.id, idUser, function (err, campaign) {
		if(err){
			throw err;
		}
		res.json(campaign);
	});
});

//Comment Campaign
router.post('/campaigns/:id/comment', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Comment.addComment(req.body.text, idPerson, function (err, comment) {
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

//like update
router.post('/update/:id/like', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Update.likeUpdate(req.params.id, idPerson, function (err, update) {
		res.json(update);
	});
});

//dislike update
router.post('/update/:id/dislike', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Update.dislikeUpdate(req.params.id, idPerson, function (err, update) {
		res.json(update);
	});
});

//Donate campaign
router.post('/campaigns/:id/donate', function (req, res) {
	var idUser = req.headers.userid;
	var idPerson = req.headers.usertypeid;
	//var body = req.body;
	Campaign.addDonation(req.body.amount, req.params.id, idUser, idPerson, function (err, campaign) {
		if(err){
			throw err;
		}
		Activity.addActity(idPerson, req.params.id, 'donates', function (err) {
			if(err){
				throw err;
			}
			res.json(campaign);
		});
	});
});

//Volunteer campaign
router.post('/campaigns/:id/volunteer', function (req, res) {
	var idUser = req.headers.userid;
	var idPerson = req.headers.usertypeid;
	//var body = req.body;
	Campaign.addVolunteer(req.params.id, idPerson, function (err, campaign) {
		if(err){
			throw err;
		}
		Activity.addActity(idPerson, req.params.id, 'volunteers', function (err) {
			if(err){
				throw err;
			}
			res.json(campaign);
		});
	});
});

//Comment an update
router.post('/update/:idUpdate/comment', function (req, res) {
	var idPerson = req.headers.usertypeid; //person id
	Comment.addComment(req.body.text, idPerson, function (err, comment) {
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



//Review an Donor receiving entity
router.post('/receiving-entity/:idReceivingEntity/review', function (req, res) {
	var idUser = req.headers.userid; //person id
	var body = req.body;
	body['user'] = idUser;
	Review.addReview(body, function (err, review) {
		if(err){
			throw err;
		}
		ReceivingEntity.addReview(req.params.idReceivingEntity, review._id, function (err, receivingEntity) {
			if(err){
				throw err;
			}
			res.json(receivingEntity);
		});
	});
});


//comment review
router.post('/review/:idReview/comment', function (req, res) {
	var idPerson = req.headers.usertypeid; //person id
	Comment.addComment(req.body.text, idPerson, function (err, comment) {
		if(err){
			throw err;
		}
		Review.commentReview(req.params.idReview, comment._id, function (err, review) {
			if(err){
				throw err;
			}
			res.json(review);
		});
	});
});


//follow Donor receiving entity
router.post('/receiving-entity/:idReceivingEntity/follow', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Person.addFollowedReceivingEntity(idPerson, req.params.idReceivingEntity, function (err, person) {
		if(err){
			throw err;
		}
		res.json(person);
	});
});

//follow Company
router.post('/company/:idCompany/follow', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Person.addFollowedCompany(idPerson, req.params.idCompany, function (err, person) {
		if(err){
			throw err;
		}
		res.json(person);
	});

});

//follow Person
router.post('/person/:idPerson/follow', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Person.addFollowedPerson(idPerson, req.params.idPerson, function (err, person) {
		if(err){
			throw err;
		}
		res.json(person);
	});
});


//Add Acknowledgment Person
router.post('/person/:idPerson/acknowledgment', function (req, res) {
	var idPerson = req.params.idPerson;
	req.body.person = idPerson;
	Acknowledgment.addAcknowledgment(req.body, function (err, acknowledgment) {
		if(err){
			throw err;
		}
		res.json(acknowledgment);
	});
});


//like Adcknowledgment
router.post('/acknowledgment/:id/like', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Acknowledgment.likeAcknowledgment(req.params.id, idPerson, function (err, acknowledgment) {
		res.json(acknowledgment);
	});
});

//dislike Adcknowledgment
router.post('/acknowledgment/:id/dislike', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Acknowledgment.dislikeAcknowledgment(req.params.id, idPerson, function (err, acknowledgment) {
		res.json(acknowledgment);
	});
});

//Comment acknowlegment
router.post('/acknowledgment/:id/comment', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Comment.addComment(req.body.text, idPerson, function (err, comment) {
		if(err){
			throw err;
		}
		Acknowledgment.commentAcknowledgment(req.params.id, comment._id, function (err, acknowlegment) {
			if(err){
				throw err;
			}
			res.json(acknowlegment);
		});
	});
});


//Add donation certificate
router.post('/person/add/certificate', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Person.addDonationCertificate(idPerson, req.body.donation_certificate, function (err, person) {
		if(err){
			throw err;
		}
		res.json(person);
	});
});



//like Comment
router.post('/comment/:id/like', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Comment.likeComment(req.params.id, idPerson, function (err, comment) {
		res.json(comment);
	});
});

//dislike Comment
router.post('/comment/:id/dislike', function (req, res) {
	var idPerson = req.headers.usertypeid;
	Comment.dislikeComment(req.params.id, idPerson, function (err, comment) {
		res.json(comment);
	});
});

module.exports = router;
