import {GraphQLServer} from 'graphql-yoga';

/* Type definitions -> Describe las operaciones y estructura de los datos */
/* Scalar types -> String, Boolean, Int, Float, ID */
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(num1: Float!, num2: Float!): Float!
        subtract(numbers: [Float!]!): Float!
        grades: [Int!]!
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
    }
`

/* Resolvers -> Funciones que resuelven las consultas */
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            /*console.log(args);*/
            return (args.name && args.position) ? `Hello ${args.name}. You are my favorite ${args.position}` : 'Hello';
        },
        add(parent, {num1, num2}, ctx, info) {
            return num1 + num2;
        },
        subtract(parent, args, ctx, info) {
            if (!args.numbers.length) return 0;

            return args.numbers.reduce((accumulator, currentValue) => {
                return accumulator - currentValue;
            })
        },
        grades(parent, args, ctx, info) {
            return [99, 80, 93]
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('The server is up'));