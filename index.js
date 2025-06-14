// index.js
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

// --- Core GraphQL Components ---

// 1. The Schema (Type Definitions)
// This defines the "shape" of our API. We're defining one possible query
// called "hello" which, when called, will return a String.
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

// 2. The Resolvers
// This is an object that provides the actual functions for our schema fields.
// The structure of this object must match the structure of the schema.
const resolvers = {
  Query: {
    // This resolver function runs when the "hello" query is executed.
    hello: () => {
      return 'Hello from your GraphQL API!';
    },
  },
};

// --- Server Setup ---

const PORT = 4000;

/*
async function startServer() {
  // Create Express app
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Add JSON parsing middleware
  app.use(express.json());
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Start the server
  // We must start the server before we can apply the middleware.
  await server.start();
  
  // 4. Apply the Apollo-Express middleware
  app.use(
    '/graphql',
    cors(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        resolvers,
      }),
    })
  );

  // 5. Start the Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint ready at http://localhost:${PORT}/graphql`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
*/


(async () => {
  // Make sure express middleware is applied globally & start before app.use('graphql')
  const app = express();
  app.use(express.json());

  // 3. Create an instance of ApolloServer
  // We pass it our schema (typeDefs) and our resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // We must start the server before we can apply the middleware.
  await server.start();

  // 4. Apply the Apollo-Express middleware
  app.use(
    '/graphql',
    cors(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        resolvers,
      }),
    })
  );

  // 5. Start the Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`🚀 GraphQL endpoint ready at http://localhost:${PORT}/graphql`);
  });
})();
