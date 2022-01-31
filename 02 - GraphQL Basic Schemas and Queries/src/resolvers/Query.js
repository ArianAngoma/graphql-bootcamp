/* Importaciones propias */
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const Query = {
    users(parent, {query}, ctx, info) {
        if (!query) return User.find();

        return User.find({name: {"$regex": query, "$options": "i"}});
    },
    posts(parent, {query}, ctx, info) {
        if (!query) return Post.find();

        return Post.find({
            $or:
                [
                    {
                        title: {
                            "$regex": query,
                            "$options": "i"
                        }
                    },
                    {
                        body: {
                            "$regex": query,
                            "$options": "i"
                        }
                    }
                ]
        });
    },
    comments(parent, {query}, ctx, info) {
        if (!query) return Comment.find();

        return Comment.find({text: {"$regex": query, "$options": "i"}});
    }
}

module.exports = Query;