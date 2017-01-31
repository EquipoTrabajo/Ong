var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var activitySchema = new Schema({
	person: {
		type: Schema.Types.ObjectId, ref: 'Person'
	},
	campaign: {
		type: Schema.Types.ObjectId, ref: 'Campaign'
	},
	activity: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

var Activity = module.exports = mongoose.model('Activity', activitySchema);

// Add Activity
module.exports.addActivity = function (idPerson, idCampaign, activity, callback) {
	Activity.create({person: idPerson, campaign: idCampaign, activity: activity}, callback);
}


// Add Activity
module.exports.getActivities = function (idPerson, callback) {
	Activity.find({person: idPerson}).populate(['person', 'campaign']).exec(callback);
}
