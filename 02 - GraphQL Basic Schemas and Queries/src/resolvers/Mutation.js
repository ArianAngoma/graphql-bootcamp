const bcrypt = require('bcryptjs');

/* Impotaciones propias */
const {User, Post, Comment} = require('../models');
const {generateJWT} = require('../helpers/jwt');

const Mutation = {
    async createUser(parent, {data}, ctx, info) {
        if (data.password.length < 6) throw new Error('Password must be 6 characters or longer');

        /* Ver si el email ya esta en uso */
        const emailTaken = await User.findOne({email: data.email});

        if (emailTaken) throw new Error('Email taken.');

        const user = new User({...data});

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(data.password, salt);

        await user.save();

        /* Generar token */
        const token = await generateJWT(user.id);

        return {
            user,
            token
        }
    },
    async login(parent, {data}, ctx, info) {
        const user = await User.findOne({email: data.email});
        if (!user) throw new Error('Unable to login');
        console.log(user)
        const isMatch = await bcrypt.compareSync(data.password, user.password);
        if (!isMatch) throw new Error('Unable to login');

        /* Generar token */
        const token = await generateJWT(user.id);

        return {
            user,
            token
        }
    },
    async deleteUser(parent, {id}, ctx, info) {
        const user = await User.findByIdAndDelete(id);

        if (!user) throw new Error('User not found');

        return user;
    },
    async updateUser(parent, {id, data}, ctx, info) {
        const {password, ...dataUser} = data;

        const emailTaken = await User.findOne({email: dataUser.email});

        if (emailTaken) throw new Error('Email taken.');

        if (password) {
            const salt = bcrypt.genSaltSync();
            dataUser.password = bcrypt.hashSync(password, salt);
        }

        let user = await User.findByIdAndUpdate(id, dataUser, {new: true});

        if (!user) throw new Error('User not found');

        return user;
    },
    async createPost(parent, {data}, {pubsub}, info) {
        const userExists = await User.findById(data.author);

        if (!userExists) throw new Error('User not found');

        const post = new Post({...data});
        await post.save();

        if (data.published) pubsub.publish('post', {
            post: {
                mutation: 'CREATED',
                data: post
            }
        });

        return post;
    },
    async deletePost(parent, {id}, {pubsub}, info) {
        const post = await Post.findByIdAndDelete(id);

        if (!post) throw new Error('Post not found');

        if (post.published) pubsub.publish('post', {
            post: {
                mutation: 'DELETED',
                data: post
            }
        });

        return post;
    },
    async updatePost(parent, {id, data}, {pubsub}, info) {
        const post = await Post.findByIdAndUpdate(id, data, {new: true});

        if (!post) throw new Error('Post not found');

        pubsub.publish('post', {
            post: {
                mutation: 'UPDATED',
                data: post
            }
        });

        return post;
    },
    async createComment(parent, {data}, {pubsub}, info) {
        const userExists = await User.findById(data.author);
        const postExists = await Post.findOne({id: data.post, published: true});

        if (!userExists || !postExists) throw new Error('Unable to find user and post');

        const comment = new Comment({...data});
        await comment.save();

        pubsub.publish(`comment ${data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });

        return comment;
    },
    async deleteComment(parent, {id}, {pubsub}, info) {
        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) throw new Error('Comment not found');

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        });

        return comment;
    },
    async updateComment(parent, {id, data}, {pubsub}, info) {
        const comment = await Comment.findByIdAndUpdate(id, data, {new: true});

        if (!comment) throw new Error('Comment not found');

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        });

        return comment;
    }
}

module.exports = Mutation;