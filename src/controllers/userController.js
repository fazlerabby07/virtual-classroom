const _log = require('../utils/logger');
const userService = require('../services/user');
const classroomService = require('../services/classroom');
const _p = require('../helpers/simpleasync');
const emailDispatch = require('../dispatchers/emailSend');
const { createResponse } = require('../utils/responseGenerate');

// admin teacher registration
const createAdminTeacher = async (req, res, next) => {
	if (req.user.role === 'superAdmin') {
		const userInfo = req.body;
		const [userErr, user] = await _p(userService.createUser(userInfo));
		if (!user) {
			if (typeof userErr === 'object') {
				return next(new Error(JSON.stringify(userErr)));
			}
			_log(userErr, 'red');
			return next(new Error(userErr));
		}
		if (user.role === 'teacher') {
			await teacherEmail(userInfo);
		}
		return res.status(200).json(createResponse(user, 'user created successfully', false, null));
	} else {
		return next(new Error('auth_user_unauthorized'));
	}
};

// student registration
const createStudent = async (req, res, next) => {
	if (req.body.role === 'student' && req.body.invitationCode) {
		const userInfo = req.body;
		// first need to check if the invitation code is exist.
		const [classroomErr, classroom] = await _p(
			classroomService.getClassRoomByInvitationCode(userInfo.invitationCode),
		);
		if (classroomErr) {
			_log(classroomErr, 'red');
			return next(new Error(classroomErr));
		}
		if (!classroom) {
			_log(`No classroom created with ${userInfo.invitationCode}`, 'red');
			return next(new Error(`No classroom created with ${userInfo.invitationCode}`));
		}
		// Check student is exist using email address and studentId
		const [studentExistErr, studentExist] = await _p(userService.findByEmail(userInfo.email));

		if (studentExistErr) {
			_log(studentExistErr, 'red');
			return next(new Error(studentExistErr));
		}

		// if student exist then only enroll to the classroom
		if (studentExist) {
			// Check student already enrolled in this classroom
			const [studentEnrollErr, studentEnroll] = await _p(
				classroomService.studentAssignedClassroom(classroom._id, studentExist._id),
			);

			if (studentEnrollErr) {
				_log(studentEnrollErr, 'red');
				return next(new Error(studentEnrollErr));
			}
			if (studentEnroll) {
				return res
					.status(200)
					.json(createResponse(null, 'Student already Enrolled in this class', false, null));
			}
			const [enrollStudentErr, enrollStudent] = await _p(
				classroomService.assignStudent(classroom._id, studentExist._id),
			);
			if (enrollStudentErr) {
				_log(enrollStudentErr, 'red');
				return next(new Error(enrollStudentErr));
			} else {
				return res
					.status(200)
					.json(createResponse(studentExist, 'Enrolled successfully', false, null));
			}
		} else {
			// if student not exist then first registered student then enroll to classroom
			const [userErr, user] = await _p(userService.createUser(userInfo));
			if (!user) {
				if (typeof userErr === 'object') {
					return next(new Error(JSON.stringify(userErr)));
				}
				_log(userErr, 'red');
				return next(new Error(userErr));
			}
			const [enrollStudentErr, enrollStudent] = await _p(
				classroomService.assignStudent(classroom._id, user._id),
			);
			if (enrollStudentErr) {
				_log(enrollStudentErr, 'red');
				return next(new Error(enrollStudentErr));
			}
			return res.status(200).json(createResponse(user, 'Enrolled successfully', false, null));
		}
	} else {
		return next(new Error('auth_user_unauthorized'));
	}
};

// user login
const login = async (req, res, next) => {
	if (!req.body.email || !req.body.password) {
		return next(new Error('Please provide email and password.'));
	}
	const [jwtErr, jwt] = await _p(userService.userLogin(req.body));
	if (!jwt) {
		_log(jwtErr, 'red');
		return next(new Error(jwtErr));
	}

	return res
		.status(200)
		.json(createResponse({ isVerified: jwt.userInfo }, 'Successfully logged in', false, jwt.jwtToken));
};

const teacherEmail = async (userInfo) => {
	return new Promise(async (resolve, reject) => {
		const subject = 'Teacher Onboard';
		const emailBody = `
		<!DOCTYPE html>
		<html>
		<head>
		<style>
		.card {
		  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		  max-width: 400px;
		  margin: auto;
		  text-align: center;
		  font-family: arial;
		}
		
		.price {
		  color: grey;
		  font-size: 22px;
		}
		
		.credential {
		  border: none;
		  outline: 0;
		  padding: 12px;
		  border-left: 10px solid grey;
		  color: black;
		  background-color: #f7f7f7;
		  text-align: center;
		  cursor: pointer;
		  font-size: 18px;
		}
		
		
		</style>
		</head>
		<body>
		
		<br>
		<div class="card">
		  <img src="https://t4.ftcdn.net/jpg/04/00/59/49/360_F_400594956_UeLC38TNQPsi9SmQwc0mi5ZqFnqlzxjK.jpg" alt="Denim Jeans" style="height:300px;">
		  <h2 style="text-align:center">Welcome ${userInfo.fullName}!</h2>
		  <h3>Your teacher registration is successful!</h1>
		  <p>Here are your login credentials:</p>
		  <p class="credential">Email:${userInfo.email}  </p>
		  <p class="credential">Password:${userInfo.password} </p>
		  <br>
		</div>
		
		</body>
		</html>`;

		const [eErr, email] = await _p(
			emailDispatch.send(process.env.EMAIL_USER, userInfo.email, subject, emailBody),
		);
		if (eErr) {
			_log(eErr, 'red');
			return reject(eErr);
		} else {
			_log(email, 'green');
			return resolve();
		}
	});
};

module.exports = {
	createAdminTeacher,
	createStudent,
	login,
};
