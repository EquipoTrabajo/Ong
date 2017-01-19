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
	}
});

var Activity = module.exports = mongoose.model('Activity', activitySchema);

// Add Activity
module.exports.addActity = function (body, callback) {
	Activity.create(body, callback);
}
