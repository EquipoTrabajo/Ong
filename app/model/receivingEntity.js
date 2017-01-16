var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var receivingEntitySchema = new Schema({
	userid: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	age: {
		type: Number
	},
	slogan: {
		type: String
	},
	direction: {
		type: String
	}
});

var ReceivingEntity = mongoose.model('ReceivingEntity', receivingEntitySchema);
module.exports = ReceivingEntity;