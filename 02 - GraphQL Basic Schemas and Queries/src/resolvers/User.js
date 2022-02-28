const {
	Post,
	Comment,
} = require('../models');
const {validateJWT} = require('../middlewares/validate-jwt');

const User = {
	async posts(parent, args, ctx, info) {
		return Post.find({author: parent.id});
	},
	async comments(parent, args, ctx, info) {
		return Comment.find({author: parent.id});
	},
	async email(parent, args, {request}, info) {
		const user = await validateJWT(request, false);

		if (user && user.id === parent.id) {
			return parent.email;
		}
		return null;
	},
};

module.exports = User;
