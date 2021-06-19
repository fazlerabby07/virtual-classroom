const mongoose = require('mongoose');
const _log     = require('../utils/logger');

let dbUrl = '';

if (process.env.NODE_ENV === "production") {
	dbUrl = process.env.MONGODB_URI;
}

if (process.env.NODE_ENV === "test") {
	dbUrl = process.env.MONGODB_TEST_URI;
}

if (process.env.NODE_ENV === "development") {
	dbUrl = process.env.MONGODB_DEV_URI;
}

if(!dbUrl) {
	_log('Mongo url not set in env file', 'red');
	return new Error('Mongo url not set in env file');
}
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, error => {
	if (error) {
		_log(`FAILED to connect using mongoose. ${error}`, 'red');
	} else {
		_log(`Connected to DB server. ( ${process.env.NODE_ENV} )`, 'green');
	}
});

module.exports = mongoose;