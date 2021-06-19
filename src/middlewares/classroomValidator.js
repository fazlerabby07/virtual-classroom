const { check } = require('express-validator');

const classroomValidator = [
	check('title').exists({ checkNull: true, checkFalsy: true }),
	check('teacherId').exists({ checkNull: true, checkFalsy: true }),
];

module.exports = {
	classroomValidator,
};
