var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
	hearts: {
		type: Number,
		min: 1,
		max: 5
	},
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

var Review = module.exports = mongoose.model('Review', reviewSchema);