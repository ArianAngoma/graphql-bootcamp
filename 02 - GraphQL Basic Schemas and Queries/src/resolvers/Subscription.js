const Subscription = {
    comment: {
        subscribe(parent, {postId}, {db, pubsub, prisma}, info) {
            const post = prisma.post.findUnique({
                where: {
                    id: postId,
                    published: true
                }
            });

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