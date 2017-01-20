var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var companySchema = new Schema({
	userid: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	slogan: {
		type: String
	},
	description: {
		type: String
	},
	admins: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}]
});

var Company = module.exports = mongoose.model('Company', companySchema);

// Add Company
module.exports.addCompany = function (body, callback) {
	var user = body.user;
	User.addUser(user, function (err, user) {
		if (err) {throw err};
		var p = body.company;
		p["userid"] = user._id;
		Company.create(p, callback);
	});
}

//Add Admin
module.exports.addAdmin = function (idCompany, idPerson, callback) {
	Company.update({ _id: idCompany }, { $push: { admins: idPerson }}, callback);
}


// Get Company
module.exports.getCompanyByUsername = function (username, callback) {
	Company.findOne({'username': username}).populate('userid').exec(callback);
}
