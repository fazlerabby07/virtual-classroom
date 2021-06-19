const bcrypt = require('bcryptjs');
const rounds = 10;
const _log = require('../utils/logger');

module.exports.new = async function (password) {
	try {
		let salt = bcrypt.genSaltSync(rounds);
		return bcrypt.hashSync(password, salt);
	} catch (e) {
		_log(e.message || 'Bcrypt Error!');
		return null;
	}
};

module.exports.verify = function (password, hash) {
	try {
		return bcrypt.compareSync(password, hash);
	} catch (e) {
		_log(e.message || 'Bcrypt Error!');
		return null;
	}
};
