const jwt = require('../helpers/jwt');

const jwtDetails = async (req, res, next) => {
	let token = req.header('authorization') || req.header('token') || req.query.token;
	if (!token) {
		return next(new Error('auth_token_absent'));
	}
	const payload = await jwt.decode(token);
	if (!payload) return next(new Error('auth_token_invalid'));
	req.user = payload;
	next();
};

module.exports = {
	jwtDetails,
};
