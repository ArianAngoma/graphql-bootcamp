const User = require('../models/User');
const Post = require('../models/Post');

const Comment = {
    author(parent, args, ctx, info) {
        return User.findById(parent.author);
    },
    post(parent, args, ctx, info) {
        return Post.findById(parent.post);
    }
}

module.exports = Comment;