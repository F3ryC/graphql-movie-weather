
// index.js
// 0. Basic Imports 
import 'dotenv/config'; // Loads environment variables from .env
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

// 0.1 Import GraphQL components
import typeDefs from './src/graphql/schema.js';
import createResolvers from './src/graphql/resolvers/index.js';

// 0.2 Import REST routes setup
import { setupMovieRoutes } from './src/rest/movieRoutes.js';

// 1.0 Make sure express middleware is applied globally & start before app.use('graphql')
const app = express();
const PORT = process.env.PORT || 4000; // Use port from .env or default to 4000

// 2.0 Setup REST Routes
setupMovieRoutes(app);

// 2.1 Setup GraphQL Server ---
app.use(express.json()); // Apply JSON parsing middleware globally

// 3.0 The Resolvers
// This is an object that provides the actual functions for our schema fields.
// The structure of this object must match the structure of the schema.
const resolvers = createResolvers(PORT); // Create resolvers, passing PORT

// 4.0 Create an instance of ApolloServer
// We pass it our schema (typeDefs) and our resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 4.1 We must start the server before we can apply the middleware.
await server.start();

// 4.2 Apply the GraphQL middleware
app.use('/graphql', expressMiddleware(server));

// 5.0 Start the server - start listening 
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL endpoint ready at http://localhost:${PORT}/graphql`);
});
