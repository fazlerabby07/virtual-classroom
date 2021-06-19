const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Types.ObjectId;

const classroomSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		invitationCode: {
			type: String,
			required: true,
			trim: true,
		},
		teacherId: {
			type: ObjectId,
			required: true,
			ref: 'User'
		},
		enrolledStudents: [{
			type: ObjectId,
			required: true,
			ref: 'User'
		}],
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Classroom', classroomSchema);