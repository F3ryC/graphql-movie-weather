// index.js
import 'dotenv/config'; // Loads environment variables from .env
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import axios from 'axios'; // Import axios for making HTTP requests


// Static Geolocation data
// Add this new constant, preferably above typeDefs or resolvers
/*
const geolocationData = {
  "New York": { lat: 40.7128, lon: -74.0060 },
  "Los Angeles": { lat: 34.0522, lon: -118.2437 },
  "Chicago": { lat: 41.8781, lon: -87.6298 },
  "Houston": { lat: 29.7604, lon: -95.3698 },
  "Phoenix": { lat: 33.4484, lon: -112.0740 },
};
*/

const STATIC_LOCATIONS = {
  "Central Park": { latitude: 40.785091, longitude: -73.968285 },
  "New York City": { latitude: 40.730610, longitude: -73.935242 },
  "San Francisco": { latitude: 37.773972, longitude: -122.431297 },
  "Los Angeles": { latitude: 34.052235, longitude: -118.243683 },
  "Pier 39": { latitude: 37.809326, longitude: -122.409981 },
  "Chicago": { latitude: 41.881832, longitude: -87.623177 },
  "Seattle": { latitude: 47.608013, longitude: -122.335167 },
  "Times Square": { latitude: 40.758896, longitude: -73.985130 },
  "Santa Monica": { latitude: 34.024212, longitude: -118.496475 },
  "Santa Monica Pier": { latitude: 34.010090, longitude: -118.496948 },
  "California": { latitude: 36.778259, longitude: -119.417931 },
  "New York State": { latitude: 43.000000, longitude: -75.000000 },
  "Las Vegas": { latitude: 36.188110, longitude: -115.176468 },
  "Boston": { latitude: 42.361145, longitude: -71.057083 },
  "Miami": { latitude: 25.761681, longitude: -80.191788 },
  "Hawaii": { latitude: 19.741755, longitude: -155.844437 },
  "San Diego": { latitude: 32.715736, longitude: -117.161087 },
  "Denver": { latitude: 39.742043, longitude: -104.991531 },
  "Atlanta": { latitude: 33.753746, longitude: -84.386330 },
  "Florida": { latitude: 27.994402, longitude: -81.760254 },
  "Houston": { latitude: 29.749907, longitude: -95.358421 },
  "Honolulu": { latitude: 21.315603, longitude: -157.858093 },
  "Disneyland Park": { latitude: 33.812511, longitude: -117.918976 },
  "Phoenix": { latitude: 33.448376, longitude: -112.074036 },
  "Portland": { latitude: 45.523064, longitude: -122.676483 },
  "Dallas": { latitude: 32.779167, longitude: -96.808891 },
  "Orlando": { latitude: 28.538336, longitude: -81.379234 },
  "Texas": { latitude: 31.000000, longitude: -100.000000 },
  "Anchorage": { latitude: 61.217381, longitude: -149.863129 },
  "Philadelphia": { latitude: 39.952583, longitude: -75.165222 },
  "Alaska": { latitude: 66.160507, longitude: -153.369141 },
  "Austin": { latitude: 30.266666, longitude: -97.733330 },
  "Minneapolis": { latitude: 44.986656, longitude: -93.258133 },
  "New Orleans": { latitude: 29.951065, longitude: -90.071533 },
  "Detroit": { latitude: 42.331429, longitude: -83.045753 },
  "New Jersey": { latitude: 39.833851, longitude: -74.871826 },
  "St. Louis": { latitude: 38.627003, longitude: -90.199402 },
  "Baltimore": { latitude: 39.299236, longitude: -76.609383 },
  "Brooklyn": { latitude: 40.650002, longitude: -73.949997 },
  "Charlotte": { latitude: 35.227085, longitude: -80.843124 },
  "Ohio": { latitude: 40.367474, longitude: -82.996216 },
  "San Antonio": { latitude: 29.424349, longitude: -98.491142 },
  "Grant Park": { latitude: 41.876465, longitude: -87.621887 },
  "Sacramento": { latitude: 38.575764, longitude: -121.478851 },
  "Nashville": { latitude: 36.174465, longitude: -86.767960 },
  "Washington": { latitude: 47.751076, longitude: -120.740135 },
  "Newark": { latitude: 40.735657, longitude: -74.172363 },
  "Lincoln": { latitude: 40.806862, longitude: -96.681679 },
  "North Carolina": { latitude: 35.782169, longitude: -80.793457 },
};


// --- Core GraphQL Components ---

// 1. The Schema (Type Definitions)
// This defines the "shape" of our API. We're defining:
// one possible query called "hello" which, when called, will return a String
// one type called "Movie" with fields "title" and "year"
const typeDefs = `#graphql
  # Define our new Movie type
  type Movie {
    title: String!    # Title is required
    year: String!     # Year is required
    director: String  # Director might be unknown sometimes, so it's nullable
    plot: String      # Plot might be short or missing
    poster: String    # URL to a poster image, might be missing
    actors: [String]  # An array of strings for actor names
  }

  # New Weather type definition
type Weather {
  city: String!
  temperature: Float! # Temperature can have decimal points
  conditions: String! # e.g., "Sunny", "Cloudy", "Rain"
}
  
  type Query {
    hello: String
    # A field to query for a single movie by its ID
    movie(id: ID!): Movie
    weather(city: String!): Weather # New field to query weather by city
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
    // OLD resolver for the "movie" query
    /*
    movie: (parent, args, context, info) => {
      // In a real application, you'd fetch this from a database or external API.
      // For now, we return a hardcoded movie object based on the 'id' argument.
      console.log(`Fetching movie with ID: ${args.id}`);
      return {
        title: `The Expanded Movie Title for ID: ${args.id}`,
        year: '2024',
        director: 'AI Assistant',
        plot: 'This is a thrilling plot generated by an AI to demonstrate GraphQL.',
        poster: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=GraphQL+Movie', // A dummy image URL
        actors: ['Actor One', 'Actor Two', 'Actor Three'], // An array of actors
      };
    }
    */
    // New resolver for the "movie" query
     movie: async (parent, args, context, info) => {
      const { id } = args;
      const OMDB_API_KEY = process.env.OMDB_API_KEY;

      try {
        console.log(`Fetching movie with ID: ${args.id}`);
        console.log(`Using OMDb API Key: ${OMDB_API_KEY}`);
        console.log(`OMDb API URL: http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`);
        
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`);
        const omdbData = response.data;

        if (omdbData.Response === 'False') {
          console.error(`OMDb Error: ${omdbData.Error}`);
          return null;
        }

        return {
          title: omdbData.Title,
          year: omdbData.Year,
          director: omdbData.Director,
          plot: omdbData.Plot,
          poster: omdbData.Poster,
          actors: omdbData.Actors.split(', ').map(actor => actor.trim()),
        };

        console.log(`movie with ID: ${args.id} has been fetched successfully`);
      } catch (error) {
        console.error('Error fetching movie from OMDb:', error.message);
        throw new Error(`Failed to fetch movie with ID ${id}: ${error.message}`);
      }
    },
    // New resolver for the "weather" query
    weather: (parent, args, context, info) => {
      // For now, we'll return a hardcoded weather object
      // based on the 'city' argument.
      console.log(`Fetching weather for city: ${args.city}`);
      return {
        city: args.city, // Return the city that was requested
        temperature: 25.5, // Dummy temperature in Celsius
        conditions: 'Partly Cloudy', // Dummy conditions
      };
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
