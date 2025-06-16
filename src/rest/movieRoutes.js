
// src/rest/movieRoutes.js
// This file defines the REST API routes for fetching movie data from the OMDB API.
// It uses Express.js to create a simple RESTful service.
// This file will contain the logic for your local REST movie endpoint.
import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export function setupMovieRoutes(app) {
    app.get('/rest/movie/:id', async (req, res) => {
        const movieId = req.params.id;
        console.log(`[REST Endpoint] Request received for movie ID: ${movieId}`);

        if (!movieId) {
            console.error('[REST Endpoint] Movie ID is required');
            return res.status(400).json({ error: 'Movie ID is required' });
        }
        if (!OMDB_API_KEY) {
            console.error('[REST Endpoint] OMDb API key is not set');
            return res.status(500).json({ error: 'OMDb API key is not set. Please set the OMDB_API_KEY environment variable.' });
        }

        try {
            console.log(`[REST Endpoint] Fetching movie ID: ${movieId} from OMDb API: http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movieId}`);

            // Fetch movie data from the OMDb API using the provided movie ID
            const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movieId}`);
            const omdbData = response.data;

            if (omdbData.Response === 'False') {
                console.error(`[REST Endpoint] OMDb Error for ID ${movieId}: ${omdbData.Error}`);
                return res.status(404).json({ error: omdbData.Error || 'Movie not found' });
            }

            console.log(`[REST Endpoint] Movie data fetched successfully for ID: ${movieId} \n`);
            console.log(`[REST Endpoint] Movie Data: \n ${JSON.stringify(omdbData, null, 2)} \n`);

            res.json(omdbData);
        } catch (error) {
            console.error('[REST Endpoint] Error fetching movie from OMDb:', error.message);
            res.status(500).json({ error: 'Failed to fetch movie data from OMDb' });
        }
    });
}