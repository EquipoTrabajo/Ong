var mongoose = require('mongoose');
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
		type: Schema.Types.ObjectId, ref:'Person'
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
		}
		coordinates: []
	},
	description: {
		type: String
	},
	picture: [{
		type: String
	}]
});