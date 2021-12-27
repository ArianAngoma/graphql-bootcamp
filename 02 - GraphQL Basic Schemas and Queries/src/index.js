const {GraphQLServer} = require('graphql-yoga');
const {v4: uuidv4} = require('uuid');

/* Demo user data */
let users = [
    {
        id: '1',
        name: 'Arian',
        email: 'arian.angoma.js@gmail.com',
        age: 21
    },
    {
        id: '2',
        name: 'Andrea',
        email: 'andrea@gmail.com',
    },
    {
        id: '3',
        name: 'Israel',
        email: 'israel@gmail.com',
    }
];

/* Demo post data */
let posts = [
    {
        id: '1',
        title: 'GraphQL',
        body: 'GraphQL course',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'NodeJS',
        body: 'NodeJS course',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'ExpressJS',
        body: 'ExpressJS course',
        published: false,
        author: '3'
    }
]

/* Demo comment data */
let comments = [
    {
        id: '1',
        text: 'This worked well for me.',
        author: '1',
        post: '2'
    },
    {
        id: '2',
        text: 'Glad you enjoyed it.',
        author: '1',
        post: '3'
    },
    {
        id: '3',
        text: 'This did no work.',
        author: '2',
        post: '3'
    },
    {
        id: '4',
        text: 'Never mind. I got it to work.',
        author: '3',
        post: '1'
    }
]

/* Type definitions -> Describe las operaciones y estructura de los datos */
/* Scalar types -> String, Boolean, Int, Float, ID */
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
        me: User!
        post: Post!
    }
    
    type Mutation {
       createUser(data: CreateUserInput!): User!
       deleteUser(id: ID!): User!
       createPost(data: CreatePostInput!): Post!
       deletePost(id: ID!): Post!
       createComment(data: CreateCommentInput!): Comment!
    }
    
    input CreateUserInput {
        name: String!,
        email: String!,
        age: Int
    }
    
    input CreatePostInput {
        title: String!,
        body: String!,
        published: Boolean!,
        author: ID!
    }
    
    input CreateCommentInput {
        text: String!,
        author: ID!,
        post: ID!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]! 
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

/* Resolvers -> Funciones que resuelven las consultas */
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) return users;

            return users.filter(user => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        posts(parent, args, ctx, info) {
            if (!args.query) return posts;

            return posts.filter(post => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());

                return isTitleMatch || isBodyMatch;
            });
        },
        comments(parent, args, ctx, info) {
            if (!args.query) return comments;

            return comments.filter(comment => {
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
        createUser(parent, args, ctx, info) {
            /* Ver si el email ya esta en uso */
            const emailTaken = users.some(user => user.email === args.data.email);

            if (emailTaken) throw new Error('Email taken.');

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user);

            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id);

            if (userIndex === -1) throw new Error('User not found');

            const deletedUsers = users.splice(userIndex, 1);

            posts = posts.filter(post => {
                const match = post.author === args.id;

                if (match) comments = comments.filter(comment => comment.post !== post.id);

                return !match;
            });

            comments = comments.filter(comment => comment.author !== args.id);

            return deletedUsers[0];
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author);

            if (!userExists) throw new Error('User nor found');

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post);

            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === args.id);

            if (postIndex === -1) throw new Error('Post not found');

            const deletePosts = posts.splice(postIndex, 1);

            comments = comments.filter(comment => comment.post !== args.id);

            return deletePosts[0];
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author);
            const postExists = posts.some(post => post.id === args.data.post && post.published);

            if (!userExists || !postExists) throw new Error('Unable to find user and post');

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment);

            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.post === parent.id;
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => {
                return post.author === parent.id;
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.author === parent.id
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post);
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('The server is up'));