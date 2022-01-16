const jwt = require('jsonwebtoken');

const getUserId = (req) => {
    const header = req.request.headers.authorization;

    if (!header) throw new Error('Authentication required');

    const token = header.replace('Bearer ', '');

    try {
        const {uid} = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        return uid;
    } catch (e) {
        console.log(e);
        throw new Error('Invalid Token');
    }
}

module.exports = {getUserId}