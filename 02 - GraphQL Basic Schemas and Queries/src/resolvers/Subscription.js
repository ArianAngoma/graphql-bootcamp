const Post = require('../models/Post');

const Subscription = {
    comment: {
        async subscribe(parent, {postId}, {pubsub}, info) {
            const post = await Post.find({id: postId, published: true});

            if (!post) throw new Error('Post not found');

            return pubsub.asyncIterator(`comment ${postId}`);
        }
    },
    post: {
        subscribe(parent, args, {pubsub}, info) {
            return pubsub.asyncIterator('post');
        }
    }
}

module.exports = Subscription;