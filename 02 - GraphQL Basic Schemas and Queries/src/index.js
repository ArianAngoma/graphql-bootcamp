const {GraphQLServer} = require('graphql-yoga');
const {v4: uuidv4} = require('uuid');

const db = require('./db');

/* Resolvers -> Funciones que resuelven las consultas */
const resolvers = {
    Query: {
        users(parent, args, {db}, info) {
            if (!args.query) return db.users;

            return db.users.filter(user => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, {db}, info) {
            if (!args.query) return db.posts;

            return db.posts.filter(post => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());

                return isTitleMatch || isBodyMatch;
            });
        },
        comments(parent, args, {db}, info) {
            if (!args.query) return db.comments;

            return db.comments.filter(comment => {
                return comment.text.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        me() {
            return {
                id: '123123',
                name: 'Arian Angoma',
                email: 'arian.angoma.js@gmail.com',
                age: 21
            }
        },
        post() {
            return {
                id: '123123',
                title: 'GraphQL',
                body: 'Course GraphQL',
                published: true
            }
        }
    },
    Mutation: {
        createUser(parent, args, {db}, info) {
            /* Ver si el email ya esta en uso */
            const emailTaken = db.users.some(user => user.email === args.data.email);

            if (emailTaken) throw new Error('Email taken.');

            const user = {
                id: uuidv4(),
                ...args.data
            }

            db.users.push(user);

            return user;
        },
        deleteUser(parent, args, {db}, info) {
            const userIndex = db.users.findIndex(user => user.id === args.id);

            if (userIndex === -1) throw new Error('User not found');

            const deletedUsers = db.users.splice(userIndex, 1);

            db.posts = db.posts.filter(post => {
                const match = post.author === args.id;

                if (match) db.comments = db.comments.filter(comment => comment.post !== post.id);

                return !match;
            });

            db.comments = db.comments.filter(comment => comment.author !== args.id);

            return deletedUsers[0];
        },
        createPost(parent, args, {db}, info) {
            const userExists = db.users.some(user => user.id === args.data.author);

            if (!userExists) throw new Error('User nor found');

            const post = {
                id: uuidv4(),
                ...args.data
            }

            db.posts.push(post);

            return post;
        },
        deletePost(parent, args, {db}, info) {
            const postIndex = db.posts.findIndex(post => post.id === args.id);

            if (postIndex === -1) throw new Error('Post not found');

            const deletedPosts = db.posts.splice(postIndex, 1);

            db.comments = db.comments.filter(comment => comment.post !== args.id);

            return deletedPosts[0];
        },
        createComment(parent, args, {db}, info) {
            const userExists = db.users.some(user => user.id === args.data.author);
            const postExists = db.posts.some(post => post.id === args.data.post && post.published);

            if (!userExists || !postExists) throw new Error('Unable to find user and post');

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            db.comments.push(comment);

            return comment;
        },
        deleteComment(parent, args, {db}, info) {
            const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

            if (commentIndex === -1) throw new Error('Comment not found');

            const deletedComments = db.comments.splice(commentIndex, 1);

            return deletedComments[0];
        }
    },
    Post: {
        author(parent, args, {db}, info) {
            return db.users.find(user => user.id === parent.author);
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter(comment => {
                return comment.post === parent.id;
            });
        }
    },
    User: {
        posts(parent, args, {db}, info) {
            return db.posts.filter(post => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter(comment => {
                return comment.author === parent.id
            });
        }
    },
    Comment: {
        author(parent, args, {db}, info) {
            return db.users.find(user => user.id === parent.author);
        },
        post(parent, args, {db}, info) {
            return db.posts.find(post => post.id === parent.post);
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});

server.start(() => console.log('The server is up'));