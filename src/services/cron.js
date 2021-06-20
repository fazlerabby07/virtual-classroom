const cron = require('node-cron');
const assignmentService = require('../services/assignment');
const _p = require('../helpers/simpleasync');
const _log = require('../utils/logger');
const emailDispatch = require('../dispatchers/emailSend');
const moment = require('moment');

const cronStart = cron.schedule('* * * * *', async () => {
	const [getAllAssignmentErr, getAllAssignment] = await _p(assignmentService.getAllAssignment());
	if (getAllAssignmentErr) {
		_log('Can not fetch data for cron job', 'red');
	}

	getAllAssignment.forEach(async (assignment) => {
		let date = new Date(assignment.startDate);
		if (!assignment.isNotifyStudent && Date.now() < date - 60 * 60 * 1000) {
			const promiseEmail = assignment.classroomId.enrolledStudents.map(async (student) => {
				await sentEmailToStudent(
					student.email,
					student.fullName,
					assignment.title,
					assignment.startDate,
				);
			});
			await Promise.all(promiseEmail);
			await assignmentService.updateAssignmentById(assignment._id, { isNotifyStudent: true });
		}
	});
});

const sentEmailToStudent = async (studentEmail, studentName, assignmentTitle, startDate) => {
	return new Promise(async (resolve, reject) => {
		const subject = 'Assignment/Exam';
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
                <br>
                <img src="https://i.pinimg.com/originals/5e/84/23/5e8423f588107e2b1b08cc0597c80cc3.jpg" alt="Denim Jeans" style="height:200px;">
                <h2 style="text-align:center">Dear ${studentName}</h2>
                <h3>Your test/quiz is about to start in 1 hour!</h1>
                <p class="credential">Assignment/Exam Name:  ${assignmentTitle}</p>
                <p class="credential">start time: ${moment(startDate).format('DD-MMM-YYYY hh:mm:ss')} </p>
                <br>
                </div>

                </body>
                </html>`;
		const [eErr, email] = await _p(
			emailDispatch.send(process.env.EMAIL_USER, studentEmail, subject, emailBody),
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

module.exports = cronStart;
