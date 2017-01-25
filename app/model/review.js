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

module.exports.addReview = function (body, callback) {
	Review.create(body, callback);
}

// Add a comment to the comment array
module.exports.commentReview = function (idReview, idComment, callback) {
	Review.update({ _id: idReview }, { $push: { comment: idComment }}, callback);
}