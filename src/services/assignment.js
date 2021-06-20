const Assignment = require('../models/assignment');
const _p = require('../helpers/simpleasync');

const createAssignment = async (assignmentInfo) => {
	return new Promise(async (resolve, reject) => {
		const [createAssignmentErr, createAssignment] = await _p(Assignment.create(assignmentInfo));
		if (!createAssignmentErr) {
			return resolve(createAssignment);
		} else {
			return reject(createAssignmentErr.message);
		}
	});
};

const getAssignmentById = async (id) => {
	return new Promise(async (resolve, reject) => {
		const [assignmentsErr, assignments] = await _p(
			Assignment.find({ _id: id })
				.populate({ path: 'result.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'submission.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'teacherId', select: { fullName: 1 } }),
		);
		if (!assignmentsErr) {
			return resolve(assignments);
		} else {
			return reject(assignmentsErr.message);
		}
	});
};
const getAllAssignment = async () => {
	return new Promise(async (resolve, reject) => {
		const [assignmentsErr, assignments] = await _p(
			Assignment.find().populate({
				path: 'classroomId',
				select: { title: 1, enrolledStudents: 1 },
				populate: {
					path: 'enrolledStudents',
					select: { fullName: 1, email: 1 },
				},
			}),
		);
		if (!assignmentsErr) {
			return resolve(assignments);
		} else {
			return reject(assignmentsErr.message);
		}
	});
};
const getAllAssignmentByClassroomId = async (classroomId) => {
	return new Promise(async (resolve, reject) => {
		const [assignmentsErr, assignments] = await _p(
			Assignment.find({ classroomId: classroomId })
				.populate({ path: 'classroomId', select: { title: 1, enrolledStudents: 1 } })
				.populate({ path: 'result.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'submission.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'teacherId', select: { fullName: 1 } }),
		);
		if (!assignmentsErr) {
			return resolve(assignments);
		} else {
			return reject(assignmentsErr.message);
		}
	});
};

const updateAssignmentById = async (id, updatedAssignment) => {
	return new Promise(async (resolve, reject) => {
		const [assignmentErr, assignment] = await _p(
			Assignment.findOneAndUpdate({ _id: id }, updatedAssignment, { new: true })
				.populate({ path: 'result.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'submission.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'teacherId', select: { fullName: 1 } }),
		);

		if (!assignmentErr) {
			return resolve(assignment);
		} else {
			return reject(assignmentErr.message);
		}
	});
};

const uploadAssignmentByStudent = async (assignmentId, assignmentInfo) => {
	return new Promise(async (resolve, reject) => {
		const [assignmentErr, assignment] = await _p(
			Assignment.findOneAndUpdate(
				{ _id: assignmentId },
				{
					$addToSet: {
						submission: {
							studentId: assignmentInfo.studentId,
							fileLink: assignmentInfo.fileLink,
							submissionDate: Date.now(),
						},
					},
				},
				{ new: true },
			)
				.populate({ path: 'submission.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'teacherId', select: { fullName: 1 } }),
		);
		if (!assignmentErr) {
			return resolve(assignment);
		} else {
			return reject(assignmentErr.message);
		}
	});
};

const uploadResult = async (assignmentId, resultInfo) => {
	return new Promise(async (resolve, reject) => {
		const [assignmentErr, assignment] = await _p(
			Assignment.findOneAndUpdate(
				{ _id: assignmentId },
				{
					$addToSet: {
						result: {
							studentId: resultInfo.studentId,
							marks: resultInfo.marks,
						},
					},
				},
				{ new: true },
			)
				.populate({ path: 'result.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'submission.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'teacherId', select: { fullName: 1 } }),
		);
		if (!assignmentErr) {
			return resolve(assignment);
		} else {
			return reject(assignmentErr.message);
		}
	});
};

const checkAssignmentSubmitedByStudent = async (assignmentId, studentId) => {
	return new Promise(async (resolve, reject) => {
		const [assignmentErr, assignment] = await _p(
			Assignment.find({ _id: assignmentId, 'submission.studentId': studentId }),
		);
		if (!assignmentErr) {
			return resolve(assignment);
		} else {
			return reject(assignmentErr.message);
		}
	});
};

const getAssignmentResultForStudent = async (assignmentId, studentId) => {
	return new Promise(async (resolve, reject) => {
		const [assignmentErr, assignment] = await _p(
			Assignment.find({ _id: assignmentId, 'result.studentId': studentId })
				.populate({ path: 'result.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'submission.studentId', select: { fullName: 1, schoolId: 1 } })
				.populate({ path: 'teacherId', select: { fullName: 1 } }),
		);
		if (!assignmentErr) {
			return resolve(assignment);
		} else {
			return reject(assignmentErr.message);
		}
	});
};

module.exports = {
	createAssignment,
	getAssignmentById,
	getAllAssignment,
	getAllAssignmentByClassroomId,
	updateAssignmentById,
	uploadAssignmentByStudent,
	uploadResult,
	checkAssignmentSubmitedByStudent,
	getAssignmentResultForStudent,
};
