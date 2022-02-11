/* Importaciones propias */
const {User, Post, Comment} = require('../models')
const {validateJWT} = require('../middlewares/validate-jwt');

const Query = {
    async users(parent, {query}, ctx, info) {
        if (!query) return User.find();

        return User.find({name: {"$regex": query, "$options": "i"}});
    },
    async posts(parent, {query}, ctx, info) {
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
    async post(parent, {id}, {request}, info) {
        return Post.findById(id);
    },
    async myPosts(parent, {query}, {request}, info) {
        const user = await validateJWT(request);

        const opArgs = {
            author: user.id
        }

        if (query) {
            opArgs.$or = [
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
        }

        return Post.find(opArgs);
    },
    async comments(parent, {query}, ctx, info) {
        if (!query) return Comment.find();

        return Comment.find({text: {"$regex": query, "$options": "i"}});
    }
}

module.exports = Query;