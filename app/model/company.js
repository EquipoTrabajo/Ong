var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
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
	description: {
		type: String
	}
});

var Company = mongoose.model('Company', companySchema);
module.exports = Company;