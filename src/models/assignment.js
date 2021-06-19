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
		result: {
			type: [
				{
					studentId: {
						type: ObjectId,
						required: true,
						ref: 'User',
					},
				},
				{
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
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Assignment', assignmentSchema);
