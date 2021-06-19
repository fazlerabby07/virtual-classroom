const express = require('express');
const routes = require('./routes');
const auth = require('./middlewares/auth');
const app = express();
const cors = require('cors');
const db = require('./configs/db');
const { createSuperAdminUser } = require('./helpers/superAdminGenerator');

// Load Middlewares
app.use(express.json());
app.use(cors());
// Load Middlewares
app.use('/api/v1/pvt', auth.jwtDetails);
// Load Routes
app.use(routes);

// create admin blueprint
createSuperAdminUser();

// Listen to the Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	//debugger;
	console.log(`listening on ${PORT}`);
});

// const emailDispatcher = require('./dispatchers/emailSend');
// (async () => {
// 	try {
// 		const sendEmail = await emailDispatcher.send(
// 			process.env.EMAIL_USER,
// 			'fazlerabby07@gmail.com',
// 			'Hello',
// 			'<b>Hello, how are you?<b>',
// 		);
// 		console.log('success: ', sendEmail);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

module.exports = app;