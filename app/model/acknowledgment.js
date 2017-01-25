var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var acknowledgmentSchema = new Schema({
	likes: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}],
	dislikes: [{
		type: Schema.Types.ObjectId, ref: 'Person'
	}],
	text: {
		type: String
	},
	person: {
		type: Schema.Types.ObjectId, ref: 'Person'
	},
	campaign: {
		type: Schema.Types.ObjectId, ref: 'Campaign'
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

// Add acknowledgment to the Acknowledgment collection
module.exports.addAcknowledgment = function (acknowledgment, callback) {
	Acknowledgment.create(acknowledgment, callback);
}

// Add person to the likes array
module.exports.likeAcknowledgment = function (idAcknowledgment, idPerson, callback) {
	Acknowledgment.update({ _id: idAcknowledgment }, { $push: { likes: idPerson }}, callback);
}

// Add person to the dislikes array
module.exports.dislikeAcknowledgment = function (idAcknowledgment, idPerson, callback) {
	Acknowledgment.update({ _id: idAcknowledgment }, { $push: { dislikes: idPerson }}, callback);
}


// Add Comment to the comment array
module.exports.commentAcknowledgment = function (idAcknowledgment, idPerson, callback) {
	Acknowledgment.update({ _id: idAcknowledgment }, { $push: { comment: idPerson }}, callback);
}

module.exports.getAcknowledgments = function (idPerson, callback) {
	Acknowledgment.find({'person': idPerson}).populate(['person', 'comment', 'campaign']).exec(callback);
}