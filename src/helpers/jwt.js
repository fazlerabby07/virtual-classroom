const jwt = require('jsonwebtoken');
const _log = require('../utils/logger');

const encode = (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
			if (err) {
				_log(err.message || 'JWT Encoding Error', 'red');
				return resolve(null);
			} else {
				resolve(token);
			}
		});
	});
};

const decode = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
			if (err) {
				_log(err.message || 'JWT Decoding Error', 'red');
				return resolve(null);
			} else {
				resolve(payload);
			}
		});
	});
};

module.exports = {
	encode,
	decode,
};
