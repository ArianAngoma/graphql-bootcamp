import {GraphQLServer} from 'graphql-yoga';

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

/* Type definitions -> Describe las operaciones y estructura de los datos */
/* Scalar types -> String, Boolean, Int, Float, ID */
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!   
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
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('The server is up'));