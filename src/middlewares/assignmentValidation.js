const { check } = require('express-validator');

const assignmentValidator = [
	check('classroomId').exists({ checkNull: true, checkFalsy: true }),
    check('title').exists({ checkNull: true, checkFalsy: true }),
	check('teacherId').exists({ checkNull: true, checkFalsy: true }),
    check('lastDateOfsubmition').exists({ checkNull: true, checkFalsy: true }),
];

module.exports = {
	assignmentValidator,
};
