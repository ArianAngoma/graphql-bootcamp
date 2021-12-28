const {GraphQLServer} = require('graphql-yoga');

/* Importaciones propias */
const {Query, Mutation, User, Post, Comment} = require('./resolvers');
const db = require('./db');

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: {
        db
    }
});

server.start(() => console.log('The server is up'));