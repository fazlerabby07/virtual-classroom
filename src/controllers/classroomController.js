const classroomService = require('../services/classroom');
const _p = require('../helpers/simpleasync');
const _log = require('../utils/logger');
const { createResponse } = require('../utils/responseGenerate');

const createClassroom = async (req, res, next) => {
	if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
		const inviteCode = Math.random().toString(36).slice(-8);
		const classroomObj = {
			...req.body,
			invitationCode: inviteCode,
		};
		const [classroomErr, classroom] = await _p(classroomService.createClassroom(classroomObj));
		if (classroomErr) {
			_log(classroomErr, 'red');
			return next(new Error('Classroom creation failed'));
		}
		return res.status(200).json(createResponse(classroom, 'classroom created', false, null));
	} else {
		return next(new Error('auth_user_unauthorized'));
	}
};

const getAllClassroom = async (req, res, next) => {
	if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
		const [classroomsErr, classrooms] = await _p(classroomService.getAllClassroom());
		if (classroomsErr) {
			_log(classroomsErr, 'red');
			return next(new Error('Classrooms fetching failed'));
		}
		return res.status(200).json(createResponse(classrooms, null, false, null));
	} else {
		return next(new Error('auth_user_unauthorized'));
	}
};

const getClassRoomById = async (req, res, next) => {
	if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
		const [classroomErr, classroom] = await _p(classroomService.getClassRoomById(req.params.id));
		if (classroomErr) {
			_log(classroomErr, 'red');
			return next(new Error('Classroom fetching failed'));
		}
		return res.status(200).json(createResponse(classroom, null, false, null));
	} else {
		return next(new Error('auth_user_unauthorized'));
	}
};

const deleteClassroom = async (req, res, next) => {
	if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
		const [classroomErr, classroom] = await _p(classroomService.deleteClassroom(req.params.id));
		if (classroomErr) {
			_log(classroomErr, 'red');
			return next(new Error('Classroom delete failed'));
		}
		return res.status(200).json(createResponse(classroom, null, false, null));
	} else {
		return next(new Error('auth_user_unauthorized'));
	}
};

const updateClassroom = async (req, res, next) => {
	if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
		const [classroomErr, classroom] = await _p(classroomService.updateClassroom(req.params.id, req.body));
		if (classroomErr) {
			_log(classroomErr, 'red');
			return next(new Error('Classroom update failed'));
		}
		return res.status(200).json(createResponse(classroom, null, false, null));
	} else {
		return next(new Error('auth_user_unauthorized'));
	}
};

module.exports = {
	createClassroom,
	getAllClassroom,
	getClassRoomById,
	deleteClassroom,
	updateClassroom,
};
