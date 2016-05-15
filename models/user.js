let mongoose = require('mongoose');

let userSchema = mongoose.Schema(
{
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	registerIP: String,
	lastIP: String,
	createdAt: Date,
	lastConnectedAt: Date
});

exports.schema = mongoose.model('user', userSchema);
exports.name = 'user';