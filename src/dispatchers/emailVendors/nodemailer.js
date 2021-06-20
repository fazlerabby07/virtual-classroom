const nodeMailer = require('nodemailer');
const _log = require('../../utils/logger');

if (!process.env.EMAIL_USER && !process.env.EMAIL_PASSWORD) {
	_log('Email user and password not found in .env file', 'red');
}

const transporter = nodeMailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER, // generated ethereal user
		pass: process.env.EMAIL_PASSWORD, // generated ethereal password
	},
});
const sentEmail = async (from, to, subject, html) => {
	try {
		await transporter.sendMail({
			from,
			to,
			subject,
			html,
		});
		return true;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	sentEmail,
};
