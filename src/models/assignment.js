const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const ObjectId = mongoose.Types.ObjectId;

const assignmentSchema = new Schema(
	{
		classroomId: {
			type: String,
			required: true,
			trim: true,
			ref: 'Classroom',
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		teacherId: {
			type: ObjectId,
			required: true,
			ref: 'User',
		},
		assignmentFileLink: {
			type: String,
			required: true,
			trim: true,
		},
		lastDateOfsubmition : {
			type: Date,
			required:true
		},
		result: {
			type: [
				{
					studentId: {
						type: ObjectId,
						required: true,
						ref: 'User',
					},
					marks: {
						type: Number,
						required: true,
					},
				},
			],
		},
		submission: {
			type: [
				{
					studentId: {
						type: ObjectId,
						required: true,
						ref: 'User',
					},
					fileLink: {
						type: String,
						required: true,
						trim: true,
					},
					submissionDate: {
						type: Date,
						required: true,
					},
				},
			],
		},
		isNotifyStudent: {
			type: Boolean,
			require: true,
			default: false
		}
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Assignment', assignmentSchema);
