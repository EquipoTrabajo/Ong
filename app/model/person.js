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

var Person = mongoose.model('Person', personSchema);
module.exports = Person;

var Person = module.exports = mongoose.model('Person', personSchema);

// Get User
module.exports.getPersonByUsername = function (username, callback) {
	Person.findOne({'username': username}).populate('userid').exec(callback);
}

// Add Person
module.exports.addPerson = function (person, callback) {
	var user = person.user;
	User.addUser(user, function (err, user) {
		if (err) {throw err};
		var p = person.person;
		p["userid"] = user._id;
		Person.create(p, callback);
	});
}
