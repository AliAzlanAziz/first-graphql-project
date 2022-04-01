import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv'
import { typeDefs } from './src/typeDefs';
import { resolvers } from './src/resolvers';
import connectDB from './src/config/connectDB'
import { getUser } from './src/controllers/user'

dotenv.config({ path: './src/config/config.env' })

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'development',
    plugins: [],
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

const app = express();

server.start()
    .then(_ => {
        connectDB()
        server.applyMiddleware({ app })
    })

const PORT = process.env.PORT || 4000

app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);