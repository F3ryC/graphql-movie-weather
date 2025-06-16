
// src/graphql/resolvers/movieResolver.js
// This file contains the resolvers for the Movie type
import axios from 'axios';
// We'll pass PORT into the resolver setup in src/graphql/resolvers/index.js

// Define a function that returns the movie resolver
// This allows us to inject dependencies like PORT if needed
const movieResolver = (PORT) => async (parent, args, context, info) => {
    try {
        const { id } = args;
        const LOCAL_REST_API_URL = `http://localhost:${PORT}/rest/movie/${id}`;

        if (!id) {
            throw new Error('Movie ID is required to fetch movie data.');
        }

        console.log(`[GraphQL Movie Resolver] Calling local REST endpoint: ${LOCAL_REST_API_URL}`);

        const response = await axios.get(LOCAL_REST_API_URL);
        const omdbData = response.data;
        console.log(`[GraphQL Movie Resolver] Received data from local REST endpoint: ${JSON.stringify(omdbData, null, 2)}`);

        // Check if the response indicates an error
        if (omdbData.Response === 'False') {
            console.error(`OMDb API via REST Error: ${omdbData.Error}`);
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
    } catch (error) {
        console.error('[GraphQL Movie Resolver] Error calling local REST endpoint:', error.message);
        const errorMessage = error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : 'Failed to fetch movie data from local REST service';
        throw new Error(`GraphQL Movie Error: ${errorMessage}`);
    }
};

// Export the movieResolver function so it can be used in the GraphQL resolvers setup
export default movieResolver;
