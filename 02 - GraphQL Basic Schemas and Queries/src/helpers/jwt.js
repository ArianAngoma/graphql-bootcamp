const jwt = require('jsonwebtoken');

const generateJWT = uid => new Promise((resolve, reject) => {
	const payload = {uid};

	jwt.sign(payload, process.env.SECRET_OR_PRIVATE_KEY, {
		expiresIn: '2h',
	}, (err, token) => {
		if (err) {
			console.log(err);
			reject('The token could not be generated');
		} else {
			resolve(token);
		}
	});
});

module.exports = {
	generateJWT,
};
