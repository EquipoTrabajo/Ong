var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var receivingEntitySchema = new Schema({
	userid: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String
	},
	campaign_list: [{
		type: Schema.Types.ObjectId, ref:'Campaign'
	}],
	campaign_list_collab: [{
		type: Schema.Types.ObjectId, ref:'Campaign'
	}],
	certificate_list_selfcampaign: [{
		type: String
	}],
	certificate_list_collab_campaign: [{
		type: String
	}],
	achievements: [{
		type: String
	}],
	donor_list_person: [{
		type: Schema.Types.ObjectId, ref:'Person'
	}],
	donor_list_company: [{
		type: Schema.Types.ObjectId, ref:'Company'
	}]
});

var ReceivingEntity = mongoose.model('ReceivingEntity', receivingEntitySchema);
module.exports = ReceivingEntity;

var ReceivingEntity = mongoose.model('ReceivingEntity', receivingEntitySchema);
module.exports = ReceivingEntity;

var ReceivingEntity = module.exports = mongoose.model('ReceivingEntity', receivingEntitySchema);

// Get Receiving Entity
module.exports.getRecievingEntityByUsername = function (username, callback) {
	ReceivingEntity.findOne({'username': username}).populate('userid').exec(callback);
}

// Add Receiving Entity
module.exports.addReceivingEntity = function (receivingEntity, callback) {
	var user = receivingEntity.user;
	User.addUser(user, function (err, user) {
		if (err) {throw err};
		var re = receivingEntity.receivingEntity;
		re["userid"] = user._id;
		ReceivingEntity.create(re, callback);
	});
}
