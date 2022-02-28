const jwt = require('jsonwebtoken');

/* Importaciones propias */
const {User} = require('../models');

const validateJWT = async (request, requireAuth = true) => {
	const token = request.headers.authorization;

	if (token) {
		const {uid} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
		return User.findById(uid);
	}

	if (requireAuth) {
		throw new Error('Authentication required');
	}
};

module.exports = {validateJWT};
