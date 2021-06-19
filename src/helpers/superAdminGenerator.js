const userCrud = require('../services/user');
const _log = require('../utils/logger');
const User = require('../models/user');
const _p = require('../helpers/simpleasync');

const createSuperAdminUser = async () => {
	const [adminErr, admin] = await _p(User.findOne({ email: process.env.SUPER_ADMIN_EMAIL }));

	if (!admin) {
		const adminUser = {
			fullName: process.env.SUPER_ADMIN_NAME,
			email: process.env.SUPER_ADMIN_EMAIL,
			password: process.env.SUPER_ADMIN_PASSWORD,
			role: 'superAdmin',
		};
		const [userErr, user] = await _p(userCrud.createUser(adminUser));
		if (!user) {
			_log(JSON.stringify(userErr), 'red');
			return;
		}
		_log('Admin user successfully created', 'green');
		return;
	}

	_log('Admin User already exist', 'blue');
};

module.exports = {
	createSuperAdminUser,
};
