const assignmentService = require('../services/assigment');
const _p = require('../helpers/simpleasync');
const _log = require('../utils/logger');
const { createResponse } = require('../utils/responseGenerate');
const moment = require('moment');

const createAssignment =  async (req, res, next) => {
    if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
        let assignmentDetails = req.body;
        if(req.file) {
            console.log(req.file);
            assignmentDetails = {
                ...assignmentDetails,
                lastDateOfsubmition: moment(assignmentDetails.lastDateOfsubmition).format(),
                assignmentFileLink: `/uploads/${req.file.filename}`
            }
        } else {
            _log('Need to provide assignment file', 'red');
			return next(new Error('Need to provide assignment file'));
        }

        const [assignmentErr, assignment] = await _p(assignmentService.createAssignment(assignmentDetails));
        if (assignmentErr) {
			_log(assignmentErr, 'red');
			return next(new Error('Assignment creation failed'));
		}
		return res.status(200).json(createResponse(assignment, 'assignemnt created', false, null));
        
    }else {
        return next(new Error('auth_user_unauthorized'));
    }
};

const getAllAssignmentByClassroomId =  async (req, res, next) => {
    const [assignmentsErr, assignments] = await _p(assignmentService.getAllAssignmentByClassroomId(req.params.classroomId));
    if (assignmentsErr) {
        _log(assignmentsErr, 'red');
        return next(new Error('Assignment creation failed'));
    }
    return res.status(200).json(createResponse(assignments, null, false, null));
};

const updateAssignment = async (req, res, next) => {
    if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
        const assignmentId = req.params.id;
        let updatedAssignment = req.body;
        if(req.file) {
            updatedAssignment = {
                ...updatedAssignment,
                assignmentFileLink: `/uploads/${req.file.filename}`
            }
        }
        const [assignmentErr, assignemt] = await _p(assignmentService.updateAssignmentById(assignmentId, updatedAssignment));

        if (assignmentErr) {
            _log(assignmentErr, 'red');
            return next(new Error('Assignment creation failed'));
        }
        return res.status(200).json(createResponse(assignemt, null, false, null));
    } else {
        return next(new Error('auth_user_unauthorized'));
    }
};

const assignmentSubmitedByStudent = async ( req, res, next) => {
    if (req.user.role === 'student') {
        const assignmentId = req.params.id;
        const studentId = req.user._id;

        const [assignmentErr, assignment] = await _p(assignmentService.getAssignmentById(assignmentId));
        if (assignmentErr) {
            _log('Error on checking student already submited assignemnt', 'red');
            return next(new Error(assignmentErr));
        }

        // check if assignment submition date is over or not
        const assignmentSubmitonDate =  moment(new Date()).format();
        const lastDateOfSubmition = moment(assignment.lastDateOfsubmition).format();

        const isSubmitedDateIsOver = moment(lastDateOfSubmition).isSameOrBefore(assignmentSubmitonDate);
        if(!isSubmitedDateIsOver) {
            _log('Assignment submition date is over', 'red');
            return next(new Error('Assignment submition date is over'));
        }
        // check sutdent already submit assignment
        const [assignmentSubmitedErr, assignmentSubmited] = await _p(assignmentService.checkAssignmentSubmitedByStudent(assignmentId, studentId));
        if (assignmentSubmitedErr) {
            _log('Error on checking student already submited assignemnt', 'red');
            return next(new Error(assignmentErr));
        }
        if(assignmentSubmited.length > 0) {
            return res.status(200).json(createResponse(null, 'You already submited assignment', false, null));
        }

        // Submit assignment
        let submition = {};
        if(req.file) {
            submition.studentId = studentId;
            submition.fileLink = `/uploads/${req.file.filename}`;
            const [assignmentErr, assignemt] = await _p(assignmentService.uploadAssignmentByStudent(assignmentId, submition));
            if (assignmentErr) {
                _log(assignmentErr, 'red');
                return next(new Error('Student assignment upload failed'));
            }
            return res.status(200).json(createResponse(assignemt, null, false, null));
        } else {
            _log('Need to provide assignment file', 'red');
			return next(new Error('Need to provide assignment file'));
        }

    } else {
        return next(new Error('auth_user_unauthorized'));
    }
};

const assignmentResultPublished = async (req , res, next) => {
    if (req.user.role === 'teacher' || req.user.role === 'superAdmin') {
        const assignmentId = req.params.id;
        const resultInfo = req.body;
        const [resultErr, result] = await _p(assignmentService.uploadResult(assignmentId, resultInfo));
        if (resultErr) {
            _log(resultErr, 'red');
            return next(new Error('Result upload failed'));
        }
        return res.status(200).json(createResponse(result, null, false, null));
    } else {
        return next(new Error('auth_user_unauthorized'));
    }
};

const assignemtresultForStudent = async(req, res, next) => {
    if (req.user.role === 'student') { 
        const assignmentId = req.params.id;
        const studentId = req.user._id;

        const [studentresultErr, studentresult] = await _p(assignmentService.getAssignmentResultForStudent(assignmentId, studentId));
        if (studentresultErr) {
            _log(studentresultErr, 'red');
            return next(new Error('Result fetching failed for student'));
        }
        return res.status(200).json(createResponse(studentresult, null, false, null));

    } else {
        return next(new Error('auth_user_unauthorized'));
    }
};


module.exports = {
    createAssignment,
    getAllAssignmentByClassroomId,
    updateAssignment,
    assignmentSubmitedByStudent,
    assignmentResultPublished,
    assignemtresultForStudent
}