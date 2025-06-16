
// src/graphql/dataSources/openMeteoData.js
import axios from 'axios';

// Static Geolocation data - START
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

export const STATIC_LOCATIONS = {
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
// Static Geolocation data - END

export async function getWeatherByCoordinates(latitude, longitude) {
    try {
        console.log('[OpenMeteo DataSource] Fetching weather data from Open-Meteo API... (in openMeteoData.js)');

        if (!latitude || !longitude) {
            throw new Error('Latitude and Longitude are required to fetch weather data.');
        }
        console.log(`[OpenMeteo DataSource] Fetching weather for coordinates: (${latitude}, ${longitude})`);
        console.log(`[OpenMeteo DataSource] Open-Meteo API URL: https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&forecast_days=1`);

        // Fetch Weather using Open-Meteo (Lat/Lon)
        const weatherResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&forecast_days=1`
        );
        console.log('[OpenMeteo DataSource] Weather data fetched successfully by getWeatherByCoordinates: \n', weatherResponse.data);
        console.log('\n');

        return weatherResponse.data;
    } catch (error) {
        console.error('[OpenMeteo DataSource] Error fetching from Open-Meteo API:', error.message);
        throw new Error(`[OpenMeteo DataSource] Failed to fetch weather: ${error.message}`);
    }
}
