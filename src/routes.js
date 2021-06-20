const router = require('express').Router();

// validators
const userValidator = require('./middlewares/userValidator');
const classroomValidator = require('./middlewares/classroomValidator');
const assignmentValidator = require('./middlewares/assignmentValidation');
const { checkInvalid } = require('./middlewares/validationReject');

// flie uploader
const upload = require('./middlewares/fileUpload');

// controller
const userController = require('./controllers/userController');
const classroomController = require('./controllers/classroomController');
const assignmentController = require('./controllers/assignmentController');
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

// assignment routes
router.post('/api/v1/pvt/assignments', upload.single('assignment'), assignmentValidator.assignmentValidator, checkInvalid, assignmentController.createAssignment);
router.get('/api/v1/pvt/assignments/:classroomId', assignmentController.getAllAssignmentByClassroomId);
router.put('/api/v1/pvt/assignments/:id', assignmentController.updateAssignment);
router.put('/api/v1/pvt/assignments/:id/student-assignment', upload.single('assignment'), assignmentController.assignmentSubmitedByStudent);
router.put('/api/v1/pvt/assignments/:id/assignment-result', assignmentController.assignmentResultPublished);
router.get('/api/v1/pvt/assignments/:id/student-result', assignmentController.assignemtresultForStudent);

module.exports = router;
