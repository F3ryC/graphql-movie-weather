
// src/graphql/schema.js
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

export default typeDefs;
