const router = require('express').Router();

// validators
const userValidator = require('./middlewares/userValidator');
const classroomValidator = require('./middlewares/classroomValidator');
const { checkInvalid } = require('./middlewares/validationReject');

// controller
const userController = require('./controllers/userController');
const classroomController = require('./controllers/classroomController');
const health = require('./controllers/healthController');

// System Routes
router.get('/health', health.check);

// User routes
router.post('/login', userController.login);
router.post(
	'/api/v1/pvt/admin-teacher-registration',
	userValidator.adminTeacherValidator,
	checkInvalid,
	userController.createAdminTeacher,
);
router.post(
	'/student-registration',
	userValidator.studentValidator,
	checkInvalid,
	userController.createStudent,
);

// classroom routes
router.post(
	'/api/v1/pvt/classrooms',
	classroomValidator.classroomValidator,
	checkInvalid,
	classroomController.createClassroom,
);
router.get('/api/v1/pvt/classrooms', classroomController.getAllClassroom);
router.get('/api/v1/pvt/classrooms/:id', classroomController.getClassRoomById);
router.put('/api/v1/pvt/classrooms/:id', classroomController.updateClassroom);
router.delete('/api/v1/pvt/classrooms/:id', classroomController.deleteClassroom);

module.exports = router;
