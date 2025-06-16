
// src/graphql/dataSources/omdbAPI.js
// This file defines a data source for fetching movie data from the OMDB API.
// It encapsulates the logic for making HTTP requests to the OMDB API,

import axios from 'axios'; // Import axios for making HTTP requests

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com/'; // Base URL for the OMDB API

export async function getMovieById(id) {
    try {
        if (!id) {
            throw new Error('[OMDb DataSource] Movie ID is required to fetch movie data.');
        }
        console.log(`[OMDb DataSource] Fetching movie with ID: ${args.id}`);

        if (!OMDB_API_KEY) {
            throw new Error('[OMDb DataSource] OMDb API key is not set. Please set the OMDB_API_KEY environment variable.');
        }
        console.log(`[OMDb DataSource] Using OMDb API Key: ${OMDB_API_KEY}`);
        console.log(`[OMDb DataSource] OMDb BASE URL is: ${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${id}`);
        console.log(`[OMDb DataSource] OMDb API URL: http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`);

        const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}`);
        const omdbData = response.data;

        if (omdbData.Response === 'False') {
            console.error(`[OMDb DataSource] OMDb Error: ${omdbData.Error}`);
            return null;
        }

        console.log(`[OMDb DataSource] movie with ID: ${args.id} has been fetched successfully`);
        console.log(`[OMDb DataSource] Movie Data being returned: \n ${JSON.stringify(omdbData, null, 2)}`);

        return {
            title: omdbData.Title,
            year: omdbData.Year,
            director: omdbData.Director,
            plot: omdbData.Plot,
            poster: omdbData.Poster,
            actors: omdbData.Actors.split(', ').map(actor => actor.trim()),
        };
    } catch (error) {
        console.error(`[OMDb DataSource] Error fetching movie from OMDb:`, error.message);
        throw new Error(`[OMDb DataSource] Failed to fetch movie with ID ${id}: ${error.message}`);
    }
}