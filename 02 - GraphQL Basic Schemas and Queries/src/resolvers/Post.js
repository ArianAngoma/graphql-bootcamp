const User = require('../models/User');
const Comment = require('../models/Comment');

const Post = {
    author(parent, args, ctx, info) {
        return User.findById(parent.author);
    },
    comments(parent, args, ctx, info) {
        return Comment.find({post: parent.id});
    }
}

module.exports = Post;

