const {
	GraphQLServer,
	PubSub,
} = require('graphql-yoga');
require('dotenv').config();

/* Importaciones propias */
const {
	Query,
	Mutation,
	Subscription,
	User,
	Post,
	Comment,
} = require('./resolvers');
require('./database/config')();

const pubsub = new PubSub();

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: {
		Query,
		Mutation,
		Subscription,
		User,
		Post,
		Comment,
	},
	context({request}) {
		// Console.log(req.request.headers);
		return {
			pubsub,
			request,
		};
	},
});

server.start(() => console.log('The server is up'));
