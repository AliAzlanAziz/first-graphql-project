import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginDrainHttpServer  } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import dotenv from 'dotenv'
import { typeDefs } from './src/typeDefs';
import { resolvers } from './src/resolvers';
import connectDB from './src/config/connectDB'
import { getUser } from './src/controllers/user'

//make env var available
dotenv.config({ path: './src/config/config.env' })

//initialize variables
const PORT = process.env.PORT || 4000

//initialize server
const app = express();
const httpServer = createServer(app);

//make schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer(
    { 
        schema,
        // more on subscription context -> https://www.apollographql.com/docs/apollo-server/data/subscriptions/
        // context: (ctx, msg, args) => {
            // Returning an object will add that information to our
            // GraphQL context, which all of our resolvers have access to.
            //    return getDynamicContext(ctx, msg, args);
        // },
    },
    wsServer);

const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV === 'development',
    plugins: [ 
        // ApolloServerPluginLandingPageGraphQLPlayground({ }),
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
            return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
    context: async ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authentication || '';

        // try to retrieve a user with the token
        const user = await getUser(token);

        // add the user to the context
        return {
            user,
            // models: {
            //     User: generateUserModel({ user }),
            //     ...
            // }
        };
    },
    
    
});

server.start()
    .then(_ => {
        connectDB()
        server.applyMiddleware({ app })
    })

httpServer.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);


//another way for subscriptions via apollo-grapql-express
// https://www.apollographql.com/docs/apollo-server/v2/data/subscriptions/