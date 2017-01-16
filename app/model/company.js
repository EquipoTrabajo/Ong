var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	profile_picture: {
		type: String
	},
	cover_picture: {
		type: String
	},
	age: {
		type: Number
	},
	slogan: {
		type: String
	},
	description: {
		type: String
	},
	address: {
		city: {
			type: String
		},
		state: {
			type: String
		},
		country: {
			type: String
		}
		coordinates: []
	},
	score: {
		type: Number
	},
	level: {
		type: Number
	}
});

var Company = mongoose.model('Company', companySchema);
module.exports = Company;