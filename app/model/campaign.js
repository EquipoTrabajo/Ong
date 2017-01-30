var mongoose = require('mongoose');

var Person = require('./person');
var Donation = require('./donation');

var Schema = mongoose.Schema;

var campaignSchema = new Schema({
	category: {
		type: String
	},
	name: {
		type: String,
		required: true
	},
	start_date: {
		type: Date
	},
	end_date: {
		type: Date
	},
	aspired_amout: {
		type: Number
	},
	people_reached: {
		type: Number
	},
	priority: {
		type: Number,
		default: 0
	},
	creators: [{
		type: Schema.Types.ObjectId, ref:'User'
	}],
	collaborators: [{
		type: Schema.Types.ObjectId, ref:'ReceivingEntity'
	}],
	address: {
		city: {
			type: String
		},
		state: {
			type: String
		},
		country: {
			type: String
		},
		coordinates: {
			x: {
				type: Number
			},
			y: {
				type: Number
			}
		}
	},
	description: {
		type: String
	},
	history: {
		text: {
			type: String
		},
		banner: {
			type: String
		}
	},
	multimedia: [{
		type: String
	}],
	visits: {
		type: Number
	},
	likes: [{
		type: Schema.Types.ObjectId, ref:'Person'
	}],
	dislikes: [{
		type: Schema.Types.ObjectId, ref:'Person'
	}],
	shares: [{
		type: Schema.Types.ObjectId, ref:'Person'
	}],
	donors: [{
		type: Schema.Types.ObjectId, ref:'User'
	}],
	volunteers: [{
		type: Schema.Types.ObjectId, ref:'Person'
	}],
	certificates_list: [{
		type: String
	}],
	donations: [{
		type: Schema.Types.ObjectId, ref:'Donation'
	}],
	comments: [{
		type: Schema.Types.ObjectId, ref: 'Comment'
	}],
	updates: [{
		type: Schema.Types.ObjectId, ref: 'Update'
	}],
	validated: {
		type: Schema.Types.ObjectId, ref: 'ReceivingEntity'
	}
});


var Campaign = module.exports = mongoose.model('Campaign', campaignSchema);


// Add Campaign
module.exports.addCampaign = function (campaign, callback) {
	Campaign.create(campaign, callback);
}

// validate campaign
module.exports.validateCampaign = function (idCampaign, idReceivingEntity, callback) {
	Campaign.update({ _id: idCampaign }, { $set: { validated: idReceivingEntity }}, callback);
}

// Add udpate to the campaign array
module.exports.addUpdate = function (idCampaign, idUpdate, callback) {
	Campaign.update({ _id: idCampaign }, { $push: { updates: idUpdate }}, callback);
}

// Add volunteer
module.exports.addVolunteer = function (idCampaign, idPerson, callback) {
	Campaign.update({ _id: idCampaign }, { $push: { volunteers: idPerson }}, function (err, campaign) {
		if (err) {throw err};
		Person.addVolunteeredCampaign(idPerson, idCampaign, callback);
	});
}

// Add person who like to the likes array in the campaign collection
module.exports.likeCampaign = function (idCampaign, idPerson, callback) {
	Campaign.update({ _id: idCampaign }, { $push: { likes: idPerson }}, callback);
}

// Add person who dislike to the dislikes array in the campaign collection
module.exports.dislikeCampaign = function (idCampaign, idPerson, callback) {
	Campaign.update({ _id: idCampaign }, { $push: { dislikes: idPerson }}, callback);
}

// Add person who like to the likes array in the campaign collection
module.exports.commentCampaign = function (idCampaign, idComment, callback) {
	Campaign.update({ _id: idCampaign }, { $push: { comments: idComment }}, callback);
}

// Get Campaigns
module.exports.getCampaignById = function (id, callback) {
	Campaign.findById(id).populate(['volunteers', 'donors', 'comments', 'updates', 'donations']).exec(callback);
}


// Get Campaigns
module.exports.getAllCampaigns = function (callback, limit) {
	Campaign.find().populate(['volunteers', 'donors', 'comments', 'updates', 'donations']).exec(callback);
}

// Get Campaigns
module.exports.getRecommendedCampaigns = function (id, callback, limit) {
	Person.findById(id, function (err, person) {
		if(err){
			throw err;
		}
		Campaign.find({'_id': {$in: person.liked_campaigns}}, function (err, campaigns) {
			var creators = [];
			var tempCampId = [];
			for(var camp in campaigns) {
				tempCampId.push(campaigns[camp]._id);
				for(var i=0; i<campaigns[camp].creators.length; i++) {
					creators.push(campaigns[camp].creators[i]);
				}
			}
			Campaign.find({'creators': {$in: creators}, '_id': {$nin: tempCampId}, 'priority': {$gt: 0}, 'start_date': {$lt: Date.now()}, 'end_date': {$gt: Date.now()}}, callback);
		});
	});
}

// Get Campaigns
module.exports.getNearbyCampaigns = function (user, callback) {
	Campaign.find({'address.city': user, 'start_date': {$lt: Date.now()}, 'end_date': {$gt: Date.now()}}).populate(['volunteers', 'donors', 'comments', 'updates']).exec(callback);
}

// Get Campaigns
module.exports.getFriendsDonatedCampaigns = function (id, callback) {
	Person.findById(id, function (err, person) {
		if(err){
			throw err;
		}
		Person.find({'_id': {$in: person.friend_list}}).populate('userid').exec(function (err, persons) {
			if(err){
				throw err;
			}
			var tempCampId=[];
			for (var i = 0; i < persons.length; i++) {
				for (var d = 0; d < persons[i].donated_campaigns.length; d++) {
					tempCampId.push(persons[i].donated_campaigns[d]);
				}
				for (var v = 0; v < persons[i].volunteer_campaigns.length; v++) {
					tempCampId.push(persons[i].volunteer_campaigns[v]);
				}
			}
			console.log(tempCampId);
			Campaign.find({'_id': {$in: tempCampId}, 'start_date': {$lt: Date.now()}, 'end_date': {$gt: Date.now()}}, callback);
		});
	});
}

// Get Campaigns by category
module.exports.getCampaignsByCategory = function (category, callback) {
	Campaign.find({'category': category, 'start_date': {$lt: Date.now()}, 'end_date': {$gt: Date.now()}}).populate(['volunteers', 'donors', 'comments', 'updates']).sort({start_date: -1}).exec(callback);
}


// Add a comment to the collection
module.exports.addDonation = function (amount, idCampaign, idUser, idPerson, callback) {
	Donation.addDonation(amount, idUser, function (err, donation) {
		if(err){
			throw err;
		}
		Person.addDonatedCampaign(idPerson, idCampaign, function (err, person) {
			if(err){
				throw err;
			}
		});
		Campaign.update({ _id: idCampaign }, { $push: { donations: donation._id }}, callback);
	});
}
