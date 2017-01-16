var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
	userid: {
		type: Schema.Types.ObjectId, ref: 'User',
		required: true
	},
	age: {
		type: Number
	},
	slogan: {
		type: String
	}
});

var Person = mongoose.model('Person', personSchema);
module.exports = Person;