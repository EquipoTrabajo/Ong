var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var receivingEntitySchema = new Schema({
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
	direction: {
		type: String
	}
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

var ReceivingEntity = mongoose.model('ReceivingEntity', receivingEntitySchema);
module.exports = ReceivingEntity;