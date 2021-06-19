const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			required: true,
			trim: true,
		},
		schoolId: {
			type: String,
			required: false,
			trim: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
