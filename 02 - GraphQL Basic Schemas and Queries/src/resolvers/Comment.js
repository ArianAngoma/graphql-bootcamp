const Comment = {
	async author(parent, args, {models}, info) {
		return models.User.findById(parent.author);
	},
	async post(parent, args, {models}, info) {
		return models.Post.findById(parent.post);
	},
};

module.exports = Comment;
