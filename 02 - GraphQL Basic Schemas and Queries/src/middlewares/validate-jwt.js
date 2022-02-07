const jwt = require('jsonwebtoken');

/* Importaciones propias */
const {User} = require('../models');

const validateJWT = async (request) => {
    const token = request.headers.authorization;

    if (!token) throw new Error('Authentication required');

    try {
        const {uid} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);

        const user = await User.findById(uid);
        if (!user) throw new Error('Invalid Token');

        return user;
    } catch (e) {
        console.log(e);
        throw new Error('Invalid token');
    }
}
module.exports = {validateJWT}