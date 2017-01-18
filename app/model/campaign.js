var mongoose = require('mongoose');
var Person = require('./person');
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
		type: Schema.Types.ObjectId, ref:'User'
	}],
	unlikes: [{
		type: Schema.Types.ObjectId, ref:'User'
	}],
	shares: [{
		type: Schema.Types.ObjectId, ref:'User'
	}],
	donors: [{
		type: Schema.Types.ObjectId, ref:'User'
	}],
	volunteers: [{
		type: Schema.Types.ObjectId, ref:'User'
	}],
	certificates_list: [{
		type: String
	}]
});


var Campaign = module.exports = mongoose.model('Campaign', campaignSchema);


// Add Campaign
module.exports.addCampaign = function (campaign, callback) {
	Campaign.create(campaign, callback);
}

// Like Campaign
module.exports.likeCampaign = function (idcampaign, iduser, callback) {
	//Campaign.create(campaign, callback);
}


// Get Campaigns
module.exports.getAllCampaigns = function (callback, limit) {
	Campaign.find().populate(['volunteers', 'donors']).exec(callback);
}

// Get Campaigns
module.exports.getRecommendedCampaigns = function (id, callback, limit) {
	Person.getUserOfLikedCampaign(id, function (err, person) {
		if(err){
			throw err;
		}
		Campaign.find({'_id': {$in: person.liked_campaigns}}, function (err, campaigns) {
			var creators = [];
			var tempCampId = null;
			for(var camp in campaigns) {
				tempCampId = campaigns[camp]._id;
				for(var i=0; i<campaigns[camp].creators.length; i++) {
					creators.push(campaigns[camp].creators[i]);
				}
			}
			console.log(creators);
			Campaign.find({'creators': {$in: creators}, '_id': {$nin: tempCampId}, 'priority': {$gt: 0}, 'start_date': {$lt: Date.now()}, 'end_date': {$gt: Date.now()}}, callback);
		});
	});
}

// Get Campaigns
module.exports.getNearbyCampaigns = function (user, callback, limit) {
	Campaign.find({'address.city': user}).populate(['volunteers', 'donors']).exec(callback);
}

// Get Campaigns
module.exports.getFriendsDonatedCampaigns = function (callback, limit) {
	Campaign.find().populate(['volunteers', 'donors']).exec(callback);
}
