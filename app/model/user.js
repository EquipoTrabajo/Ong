var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
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
		coordinates: []
	},
	score: {
		type: Number
	},
	level: {
		type: Number
	}
});

var User = mongoose.model('User', userSchema);
module.exports = User;