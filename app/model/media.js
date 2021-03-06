var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
	url: {
		type: String
	},
	description: {
		type: String
	},
	campaign: {
		type: Schema.Types.ObjectId, ref: 'Campaign'
	},
	person: {
		type: Schema.Types.ObjectId, ref: 'Person'
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});


var Media = module.exports = mongoose.model('Media', mediaSchema);

// Add Media
module.exports.addMedia = function (user, callback) {
	Media.create(user, callback);
}

module.exports.getMediaByCampaign = function (idCampaign, callback) {
	Media.find({'campaign': idCampaign}).populate(['person']).exec(callback);
}

module.exports.getMediaByPerson = function (idPerson, callback) {
	Media.find({'person': idPerson}).populate(['campaign']).exec(callback);
}

