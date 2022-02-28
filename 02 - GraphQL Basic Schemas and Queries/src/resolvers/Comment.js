/* Importaciones propias */
const {
	User,
	Post,
} = require('../models');

const Comment = {
	async author(parent, args, ctx, info) {
		return User.findById(parent.author);
	},
	async post(parent, args, ctx, info) {
		return Post.findById(parent.post);
	},
};

module.exports = Comment;
