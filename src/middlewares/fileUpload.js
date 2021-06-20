const path = require('path');
const multer = require('multer');
const _log = require('../utils/logger');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname,'../public/uploads'));
	},
	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		cb(null, Date.now() + ext);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf') {
			cb(null, true);
		} else {
			_log('only png, jpg and pdf file supported', 'red');
			cb(null, false);
		}
	},
});

module.exports = upload;