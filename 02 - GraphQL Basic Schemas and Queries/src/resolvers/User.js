const Post = require('../models/Post');
const Comment = require('../models/Comment');

const User = {
    posts(parent, args, ctx, info) {
        return Post.find({author: parent.id});
    },
    comments(parent, args, ctx, info) {
        return Comment.find({author: parent.id});
    }
}

module.exports = User;