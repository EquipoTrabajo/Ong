var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var acknowledgmentSchema = new Schema({
	likes: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	dislikes: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	text: {
		type: String
	},
	user: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	comment: [{
		type: Schema.Types.ObjectId, ref: 'Comment'
	}]
});

var Acknowledgment = module.exports = mongoose.model('Acknowledgment', acknowledgmentSchema);