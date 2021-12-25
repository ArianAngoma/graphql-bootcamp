import {GraphQLServer} from 'graphql-yoga';
import {v4 as uuidv4} from 'uuid';

/* Demo user data */
const users = [
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
const posts = [
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
const comments = [
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
       createUser(name: String!, email: String!, age: Int): User!
       createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
       createComment(text: String!, author: ID!, post: ID!): Comment!
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
            const emailTaken = users.some(user => user.email === args.email);

            if (emailTaken) throw new Error('Email taken.');

            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            }

            users.push(user);

            return user;
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author);

            if (!userExists) throw new Error('User nor found');

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            }

            posts.push(post);

            return post;
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.author);
            const postExists = posts.some(post => post.id === args.post && post.published);

            if (!userExists || !postExists) throw new Error('Unable to find user and post');

            const comment = {
                id: uuidv4(),
                text: args.text,
                author: args.author,
                post: args.post
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