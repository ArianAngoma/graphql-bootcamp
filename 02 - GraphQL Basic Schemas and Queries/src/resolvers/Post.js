const Post = {
	async author(parent, args, {models}, info) {
		return models.User.findById(parent.author);
	},
	async comments(parent, args, {models}, info) {
		return models.Comment.find({post: parent.id});
	},
};

module.exports = Post;
