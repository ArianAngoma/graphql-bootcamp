import {GraphQLServer} from 'graphql-yoga';

/* Type definitions -> Describe las operaciones y estructura de los datos */
/* Scalar types -> String, Boolean, Int, Float, ID */
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`

/* Resolvers -> Funciones que resuelven las consultas */
const resolvers = {
    Query: {
        id() {
            return '123123'
        },
        name() {
            return 'Arian Angoma'
        },
        age() {
            return 21
        },
        employed() {
            return true
        },
        gpa() {
            return null
        },
        title() {
            return 'The War of Art'
        },
        price() {
            return 12.99
        },
        releaseYear() {
            return 2000
        },
        rating() {
            return 5
        },
        inStock() {
            return true
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => console.log('The server is up'));