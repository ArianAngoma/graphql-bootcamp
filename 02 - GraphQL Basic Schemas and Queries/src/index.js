const {GraphQLServer, PubSub} = require('graphql-yoga');
const {PrismaClient} = require('@prisma/client');

/* Importaciones propias */
const {Query, Mutation, Subscription, User, Post, Comment} = require('./resolvers');
const db = require('./db');

const pubsub = new PubSub();
const prisma = new PrismaClient();

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
        prisma,
        pubsub
    }
});

server.start(() => console.log('The server is up'));