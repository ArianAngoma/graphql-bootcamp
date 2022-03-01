const jwt = require('jsonwebtoken');

/* Importaciones propias */
const {User} = require('../models');

const validateJWT = async (request, requireAuth = true) => {
  const token = request ? request.headers.authorization : request.connection.context.Authorization;

  if (token) {
    const {uid} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    return User.findById(uid);
  }

  if (requireAuth) {
    throw new Error('Authentication required');
  }
};

module.exports = {validateJWT};
