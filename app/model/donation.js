var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var donationSchema = new Schema({
	amount: {
		type: Number
	},
	user: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

var Donation = module.exports = mongoose.model('Donation', donationSchema);

// Add a comment to the collection
module.exports.addDonation = function (amount, idUser, callback) {
	Comment.create({amount: amount, user: idUser}, callback);
}
