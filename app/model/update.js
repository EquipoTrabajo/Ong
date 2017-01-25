var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var updateSchema = new Schema({
	likes: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}],
	dislikes: [{
		type: Schema.Types.ObjectId, ref: 'Person'
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

// Add Update to the update collection
module.exports.addUpdate = function (update, callback) {
	Update.create(update, callback);
}


// Add person to the likes array
module.exports.likeUpdate = function (idUpdate, idPerson, callback) {
	Update.update({ _id: idUpdate }, { $push: { likes: idPerson }}, callback);
}

// Add person to the dislikes array
module.exports.dislikeUpdate = function (idUpdate, idPerson, callback) {
	Update.update({ _id: idUpdate }, { $push: { dislikes: idPerson }}, callback);
}

// Add a comment to the comment array in the update collection
module.exports.commentUpdate = function (idUpdate, idComment, callback) {
	Update.update({ _id: idUpdate }, { $push: { comment: idComment }}, callback);
}

