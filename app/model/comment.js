var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	likes: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}],
	dislikes: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}],
	text: {
		type: String
	},
	user: {
		type: Schema.Types.ObjectId, ref: 'Person'
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	comment: [{
		type: Schema.Types.ObjectId, ref: 'Comment'
	}]
});

var Comment = module.exports = mongoose.model('Comment', commentSchema);

// Add a comment to the collection
module.exports.addComment = function (textComment, idUser, callback) {
	Comment.create({text: textComment, user: idUser}, callback);
}