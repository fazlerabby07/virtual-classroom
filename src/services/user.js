const User = require('../models/user');
const _log = require('../utils/logger');
const _jwt = require('../helpers/jwt');
const _password = require('../helpers/passwordHash');
const _p = require('../helpers/simpleasync');

const createUser = async (userInfo) => {
	return new Promise(async (resolve, reject) => {
		const passwordHash = await _password.new(userInfo.password);
		const newUserWithHash = {
			...userInfo,
			password: passwordHash,
		};
		const [saveUserErr, saveUserInfo] = await _p(User.create(newUserWithHash));
		if (!saveUserErr) {
			return resolve(saveUserInfo);
		} else {
			return reject(userErr.message);
		}
	});
};

const userLogin = async (userInfo) => {
	return new Promise(async (resolve, reject) => {
		const [userErr, user] = await _p(User.findOne({ email: userInfo.email }));
		if (!user) {
			return 'User not found.';
		}

		const passwordValidate = _password.verify(userInfo.password.trim(), user.password);
		if (!passwordValidate) return 'Incorrect password';

		const jwtInfo = {
			_id: user._id,
			email: user.email,
			role: user.role,
			ttl: 1800000,
		};

		const [jwtErr, jwtToken] = await _p(_jwt.encode(jwtInfo));

		const jwtTokenWithData = {
			jwtToken: jwtToken,
		};
		if (!jwtErr) {
			return resolve(jwtTokenWithData);
		} else {
			return reject(jwtErr);
		}
	});
};

const updateUser = async (userId, userInfo) => {
	return new Promise(async (resolve, reject) => {
		if ('password' in userInfo) {
			const newPassword = await _password.new(userInfo.password);
			userInfo = { ...userInfo, password: newPassword };
		}
		const [userErr, updateUserInfo] = await _p(
			User.findOneAndUpdate({ _id: userId }, userInfo, {
				new: true,
				useFindAndModify: false,
			}),
		);
		if (!userErr) {
			delete updateUserInfo._doc.password;
			return resolve(updateUserInfo);
		} else {
			return reject(userErr.message);
		}
	});
};

const deleteUser = async (userId) => {
	return new Promise(async (resolve, reject) => {
		const [userErr, user] = await _p(
			User.findOneAndUpdate(
				{
					_id: userId,
				},
				{
					deletedAt: moment().format(),
				},
				{ new: true, useFindAndModify: false },
			),
		);

		if (!userErr) {
			delete user.password;
			return resolve(user);
		} else {
			return reject(userErr.message);
		}
	});
};

// Find by Email
const findByEmail = async (email) => {
	return new Promise(async (resolve, reject) => {
		let [userErr, user] = await _p(User.findOne({ email }));
		if (!user) {
			return resolve(null);
		} else {
			resolve(user);
		}
	});
};

const uniqueEmailValidator = async function (email) {
	return new Promise(async (resolve, reject) => {
		let [userErr, user] = await _p(User.findOne({ email }));
		if (user) {
			return reject('already in use');
		} else {
			resolve(null);
		}
	});
};

module.exports = {
	createUser,
	userLogin,
	updateUser,
	deleteUser,
	findByEmail,
	uniqueEmailValidator,
};
