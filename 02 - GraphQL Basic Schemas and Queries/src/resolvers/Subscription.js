const Subscription = {
	comment: {
		async subscribe(parent, {postId}, {
			pubsub,
			models,
		}, info) {
			const post = await models.Post.find({
				id: postId,
				published: true,
			});

			if (!post) {
				throw new Error('Post not found');
			}

			return pubsub.asyncIterator(`comment ${postId}`);
		},
	},
	post: {
		subscribe(parent, args, {pubsub}, info) {
			return pubsub.asyncIterator('post');
		},
	},
};

module.exports = Subscription;
