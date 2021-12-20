import {GraphQLServer} from 'graphql-yoga';

/* Type definitions -> Describe las operaciones y estructura de los datos */
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

/* Resolvers -> Funciones que resuelven las consultas */
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query'
        },
        name() {
            return 'Arian Angoma'
        },
        location() {
            return 'Perú'
        },
        bio() {
            return 'Software Developer'
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('The server is up'));