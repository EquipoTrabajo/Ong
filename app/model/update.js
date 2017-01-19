var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var updateSchema = new Schema({
	likes: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	dislikes: [{
		type: Schema.Types.ObjectId, ref: 'User'
	}],
	picture: {
		type: String
	},
	text: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	comment: [{
		type: Schema.Types.ObjectId, ref: 'Comment'
	}]
});

var Update = module.exports = mongoose.model('Update', updateSchema);

// Add Campaign
module.exports.addUpdate = function (update, callback) {
	Update.create(update, callback);
}
