
// src/graphql/resolvers/index.js
// This file will combine all your specific resolvers into the single resolvers object required by Apollo Server.
import movieResolver from './movieResolver.js';
import weatherResolver from './weatherResolver.js';

// This function combines all resolvers and allows for dependency injection (like PORT)
const createResolvers = (PORT) => ({
    Query: {
        hello: () => 'Hello from your GraphQL API!',
        movie: movieResolver(PORT), // Pass PORT to the movie resolver
        weather: weatherResolver,
    },
    // Mutations will go here later
});

export default createResolvers;