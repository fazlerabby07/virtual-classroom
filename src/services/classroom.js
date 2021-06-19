const Classroom = require('../models/classroom');
const _p = require('../helpers/simpleasync');
const _log = require('../utils/logger');

const createClassroom = async (classroomInfo) => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classroom] = await _p(Classroom.create(classroomInfo));
		if (!classroomErr) {
			return resolve(classroom);
		} else {
			return reject(classroomErr.message);
		}
	});
};

const getAllClassroom = async () => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classrooms] = await _p(
			Classroom.find()
				.populate({
					path: 'teacher',
				})
				.populate({
					path: 'enrolledStudents',
				})
				.sort({ createdAt: 'desc' }),
		);
		if (!classroomErr) {
			return resolve(classrooms);
		} else {
			return reject(classroomErr.message);
		}
	});
};

const getClassRoomById = async (id) => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classroom] = await _p(
			Classroom.findOne({ _id: id })
				.populate({
					path: 'teacher',
				})
				.populate({
					path: 'enrolledStudents',
				}),
		);
		if (!classroomErr) {
			return resolve(classroom);
		} else {
			return reject(classroomErr.message);
		}
	});
};

const getClassRoomByInvitationCode = async (invitationCode) => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classroom] = await _p(
			Classroom.findOne({ invitationCode: invitationCode })
				.populate({
					path: 'teacher',
				})
				.populate({
					path: 'enrolledStudents',
				}),
		);
		if (!classroomErr) {
			return resolve(classroom);
		} else {
			return reject(classroomErr.message);
		}
	});
};

const updateClassroom = async (id, classroomInfo) => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classroom] = await _p(
			Classroom.findByIdAndUpdate({ _id: id }, classroomInfo, { new: true })
				.populate({
					path: 'teacher',
				})
				.populate({
					path: 'enrolledStudents',
				}),
		);
		if (!classroomErr) {
			return resolve(classroom);
		} else {
			return reject(classroomErr.message);
		}
	});
};

const deleteClassroom = async (id) => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classroom] = await _p(Classroom.findByIdAndDelete({ _id: id }));

		if (!classroomErr) {
			return resolve(classroom);
		} else {
			return reject(classroomErr);
		}
	});
};

const assignStudent = async (id, studentId) => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classroom] = await _p(
			Classroom.findByIdAndUpdate(
				{ _id: id },
				{
					$addToSet: {
						enrolledStudents: studentId,
					},
				},
				{ new: true },
			)
				.populate({ path: 'teacher' })
				.populate({ path: 'enrolledStudents' }),
		);
		if (!classroomErr) {
			return resolve(classroom);
		} else {
			return reject(classroomErr.message);
		}
	});
};

const studentAssignedClassroom = async (classroomId, studentId) => {
	return new Promise(async (resolve, reject) => {
		const [classroomErr, classroom] = await _p(
			Classroom.findOne({ _id: classroomId, enrolledStudents: studentId })
				.populate({
					path: 'teacher',
				})
				.populate({
					path: 'enrolledStudents',
				}),
		);
		if (!classroomErr) {
			return resolve(classroom);
		} else {
			return reject(classroomErr.message);
		}
	});
};

module.exports = {
	createClassroom,
	getAllClassroom,
	getClassRoomById,
	getClassRoomByInvitationCode,
	updateClassroom,
	deleteClassroom,
	assignStudent,
	studentAssignedClassroom,
};
