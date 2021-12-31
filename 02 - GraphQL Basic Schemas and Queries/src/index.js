const {GraphQLServer, PubSub} = require('graphql-yoga');

/* Importaciones propias */
const {Query, Mutation, Subscription, User, Post, Comment} = require('./resolvers');
const db = require('./db');

const pubsub = new PubSub();


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context: {
        db,
        pubsub
    }
});

server.start(() => console.log('The server is up'));