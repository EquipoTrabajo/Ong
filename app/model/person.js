var mongoose = require('mongoose');
var User = require('./user.js')


var Schema = mongoose.Schema;

var personSchema = new Schema({
	userid: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	/*facebookid: {
		type: String
	},*/
	age: {
		type: Number
	},
	slogan: {
		type: String
	},
	friend_list: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}],
	followed_people: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}],
	followed_companies: [{
		type: Schema.Types.ObjectId, ref: 'Company'
	}],
	followed_receivingEntities: [{
		type: Schema.Types.ObjectId, ref: 'ReceivingEntity'
	}],
	donated_campaigns: [{
		type: Schema.Types.ObjectId, ref: 'Campaign'
	}],
	volunteer_campaigns: [{
		type: Schema.Types.ObjectId, ref: 'Campaign'
	}],
	liked_campaigns: [{
		type: Schema.Types.ObjectId, ref: 'Campaign'
	}],
	seen_campaigns: [{
		type: Schema.Types.ObjectId, ref: 'Campaign'
	}],
	friends_donated_campaigns: [{
		type: Schema.Types.ObjectId, ref: 'Campaign'
	}],
	donation_certificate: [{
		type: String
	}]
});

var Person = module.exports = mongoose.model('Person', personSchema);

// Add Person
module.exports.addPerson = function (body, callback) {
	var user = body.user;
	User.addUser(user, function (err, user) {
		if (err) {throw err};
		var p = body.person;
		p["userid"] = user._id;
		Person.create(p, callback);
	});
}

// Get User
module.exports.getPersonByUsername = function (username, callback) {
	Person.findOne({'username': username}).populate('userid').exec(callback);
}

// Get User
module.exports.getPersonById = function (id, callback) {
	Person.findById(id).populate('userid').exec(function (err, person) {
		if(err){
			throw err;
		}else {
			return person;
		}
	});
}

module.exports.addVolunteeredCampaign = function (idPerson, idCampaign, callback) {
	Person.update({ _id: idPerson }, { $push: { volunteer_campaigns: idCampaign }}, callback);
}

//Seen Campaigns
module.exports.addSeenCampaign = function (idPerson, idCampaign, callback) {
	Person.update({ _id: idPerson }, { $push: { seen_campaigns: idCampaign }}, callback);
}

module.exports.addDonatedCampaign = function (idPerson, idCampaign, callback) {
	Person.update({ _id: idPerson }, { $push: { donated_campaigns: idCampaign }}, callback);
}

//follow Person
module.exports.addFollowedPerson = function (idPerson, idFollow, callback) {
	Person.update({ _id: idPerson }, { $push: { followed_people: idFollow }}, callback);
}

//follow Campaign
module.exports.addFollowedCompany = function (idPerson, idFollow, callback) {
	Person.update({ _id: idPerson }, { $push: { followed_companies: idFollow }}, callback);
}

//follow Campaign
module.exports.addFollowedReceivingEntity = function (idPerson, idFollow, callback) {
	Person.update({ _id: idPerson }, { $push: { followed_receivingEntities: idFollow }}, callback);
}

//Add Donation Certificate
module.exports.addDonationCertificate = function (idPerson, certificate, callback) {
	Person.update({ _id: idPerson }, { $push: { donation_certificate: certificate }}, callback);
}

// Get User
module.exports.getUserOfLikedCampaign = function (id, callback) {
	Person.findById(id, callback);
}

