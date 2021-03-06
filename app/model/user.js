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
		coordinates: {
			x: {
				type: Number
			},
			y: {
				type: Number
			}
		}
	},
	score: {
		type: Number
	},
	level: {
		type: Number
	},
	type: {
		type: String
	}
});


var User = module.exports = mongoose.model('User', userSchema);




// Add User
module.exports.addUser = function (user, callback) {
	User.create(user, callback);
}


module.exports.getUserById = function (id, callback) {
	User.findById(id, callback);
}

//change profile picture
module.exports.changeProfilePicture = function (idUser, picture, callback) {
	User.update({ _id: idUser }, {profile_picture: picture}, callback);
}
