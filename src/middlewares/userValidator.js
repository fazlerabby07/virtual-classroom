const userService = require('../services/user');
const { check } = require('express-validator');

const adminTeacherValidator = [
	check('fullName').exists({ checkNull: true, checkFalsy: true }),
	check('email').isEmail().custom(userService.uniqueEmailValidator),
	check('password').exists({ checkNull: true, checkFalsy: true }).isLength({ min: 6 }),
	check('role').exists({ checkNull: true, checkFalsy: true }),
];

const studentValidator = [
	check('fullName').exists({ checkNull: true, checkFalsy: true }),
	check('email').isEmail(),
	check('password').exists({ checkNull: true, checkFalsy: true }).isLength({ min: 6 }),
	check('role').exists({ checkNull: true, checkFalsy: true }),
	check('schoolId').exists({ checkNull: true, checkFalsy: true }),
	check('invitationCode').exists({ checkNull: true, checkFalsy: true }),
];

module.exports = {
	adminTeacherValidator,
	studentValidator,
};
