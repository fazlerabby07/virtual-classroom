const nodemailer = require('./emailVendors/nodemailer');

const send = async (from, to, subject, html) => {
	return new Promise(async (resolve, reject) => {
		try {
			const emailInfo = await nodemailer.sentEmail(from, to, subject, html);
			return resolve(emailInfo);
		} catch (err) {
			return reject(err.message);
		}
	});
};

module.exports = {
	send,
};
