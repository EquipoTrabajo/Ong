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
var config = require('../app/config/config');
var jwt    = require('jsonwebtoken');
var Step = require('step');

var FB              = require('fb');

FB.options({
    appId:          config.facebook.appId,
    appSecret:      config.facebook.appSecret,
    redirectUri:    config.facebook.redirectUri
});

//Esta función trae la información de la base de datos la devuelve con el return.
var getFacebookData = function () {
	FB.setAccessToken('EAARrouPipCwBAGlMsiQ1jxtUYQKd2YjdnyAkPvZCFLtrSUhdeZBNK5LE5EghXtZBht90kvJ8aHyWrBlZBFz5pZCr0CmPsWXDhUZC3CFNrC8RzR2oXCjkZCieutSlEaDRkMFllpdAFYLmfEQ00FH7tWJIARwFhb90FvdYs71SIue4AZDZD');
	//Los datos del token y el id de usuario se lo pase directamente mientras la pruebo
	FB.api('153198048513340', { fields: ['id','name','cover','picture','location','gender','education','email','friends', 'likes{name,category}'] }, 
	function (response) {
		console.log(response); //Está información se muestra bien, pero después de que el server me arroja el error 500
		return response; //Esta es la información traida de facebook
	});
}

//Esta funcion se encarga de procesar la data traida de facebook para poder guardarla en la base de datos.
var processFacebookData = function (response) {
	if(!response || response.error) {
		console.log(!response ? 'error occurred' : response.error);
		return null;
	}
	var address= response.location.name.split(',');
	var person = {
		"user": {
			"name": response.name,
			"profile_picture": response.picture.data.url,
			"cover_picture": response.cover.source,
			"score": 100,
			"level": 1,
			"address": {
				"city": address[0],
				"state": address[1],
				"country": address[2],
				"coordinates": {
					"x":15,
					"y":78
				}
			},
			"type": "person"
		},
		"person": {
			"username": response.id,
			"facebookid": response.id,
			"age": 36,
			"slogan": "Donar es mi meta",
			"followed_people": response.friends.data,
			"friend_list": []
		}
	};
	console.log(person);
	return person; //está es la información ya lista para ser enviada a la base de datos.
}

//está ruta la creé con el solo proposito de probar y mostrar la información de facebook pero cuando trato de mostrarlo me da un error 500
router.get('/testing', function (req, res) {
	//Step es una librería que se usa en la documentación del respositorio del repositorio de fb
	//aquí la estoy probando pero no me da resultados
	Step(getFacebookData(), function (response) {
		res.json(processFacebookData(response)); //aquí se supone que devuelve la persona en formato, pero no lo hace.
	});
});


//Esto es otra prueba que hice, si le paso el id y el token por el get, funciona bien, me muestra los datos formato json.
//pero supongo que es delicado con la seguridad.
router.get('/api/facebook/:id/:access_token', function (req, res) {
	//var accessToken = req.headers.access_token;
	FB.setAccessToken(req.params.access_token);
	FB.api(req.params.id, { fields: ['id','name','cover','picture','location','gender','education','email','friends', 'likes{name,category}'] }, function (fbres) {
	  if(!fbres || fbres.error) {
	    console.log(!fbres ? 'error occurred' : fbres.error);
	    return;
	  }
	  //console.log(res.id);
	  //console.log(res.name);
	  res.json(fbres);
	});
});

router.get('/', function (req, res) {
	res.render('index');
});


router.get('/login/facebook', function (req, res) {
	res.render('logfacebook');
});


router.post('/authenticate', function(req, res) {
  Person.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      var token = jwt.sign(user, config.secret);
      res.json({success: true, token: token});
    }
  });
});

//CREATE PERSON TO THE DATABASE
router.post('/person', function (req, res, next) {
	var person = facebookData(req.body);
	//var person = req.body;
	console.log(person);
	var fid = 'notexists';
	if (person.person.facebookid) {
		fid = person.person.facebookid;
	}
	//console.log(person.person.facebookid);

	Person.findOne({'facebookid' : fid}, function (err, personfound) {
		if(err){
			throw err;
		}
		if(personfound) {
			res.json(personfound);
		}else {
			Person.addPerson(person, function (err, person) {
				if(err){
					throw err;
				}
				res.json(person);
			});
		}
	});
});

//aplying auth middleware
router.use(require('../app/controller/auth'));

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
