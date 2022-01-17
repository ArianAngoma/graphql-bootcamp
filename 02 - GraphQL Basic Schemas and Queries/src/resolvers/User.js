const Post = require('../models/Post');
const Comment = require('../models/Comment');

const User = {
    // Todo revisar el error de async
    async posts(parent, args, ctx, info) {
        return Post.find({author: parent.id});
    },
    async comments(parent, args, ctx, info) {
        return Comment.find({author: parent.id});
    }
}

module.exports = User;