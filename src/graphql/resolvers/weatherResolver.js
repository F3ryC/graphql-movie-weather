
// src/graphql/resolvers/weatherResolver.js
// This file contains the resolver for the Weather type
import { STATIC_LOCATIONS, getWeatherByCoordinates } from '../dataSources/openMeteoData.js'; // Adjust path

const weatherResolver = async (parent, args, context, info) => {
    try {
        const { city } = args;

        // Look up coordinates in our static list
        const location = STATIC_LOCATIONS[city];

        if (!location) {
            console.error(`[GraphQL Movie Resolver] Weather Error: City '${city}' not found in static list.`);
            // Returning null for a field is how GraphQL signals that data for that field couldn't be resolved.
            return null;
        }

        const { latitude, longitude } = location;

        console.log(`[GraphQL Movie Resolver] Fetching weather for ${city} at coordinates (${latitude}, ${longitude})`);
        console.log(`[GraphQL Movie Resolver] Open-Meteo API URL: https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&forecast_days=1`);

        // Fetch Weather using Open-Meteo (Lat/Lon)
        const weatherData = await getWeatherByCoordinates(latitude, longitude);

        // Check if the response contains current weather data
        if (!weatherData.current_weather) {
            console.error(`[GraphQL Movie Resolver] Open-Meteo Error: No current weather data for ${city}`);
            return null;
        }

        // Added `temperature_unit=fahrenheit` and `forecast_days=1` for current weather only.
        const { temperature, weathercode } = weatherData.current_weather;
        console.log(`[GraphQL Movie Resolver] Current weather for ${city}:`, weatherData.current_weather);
        console.log(`[GraphQL Movie Resolver] Temperature: ${temperature}°F, Weather Code: ${weathercode} \n`);

        // Map Open-Meteo's weathercode to human-readable conditions
        const conditionsMap = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Fog', 48: 'Depositing rime fog',
            51: 'Drizzle: Light', 53: 'Drizzle: Moderate', 55: 'Drizzle: Dense intensity',
            56: 'Freezing Drizzle: Light', 57: 'Freezing Drizzle: Dense intensity',
            61: 'Rain: Slight', 63: 'Rain: Moderate', 65: 'Rain: Heavy intensity',
            66: 'Freezing Rain: Light', 67: 'Freezing Rain: Heavy intensity',
            71: 'Snow fall: Slight', 73: 'Snow fall: Moderate', 75: 'Snow fall: Heavy intensity',
            77: 'Snow grains',
            80: 'Rain showers: Slight', 81: 'Rain showers: Moderate', 82: 'Rain showers: Violent',
            85: 'Snow showers: Slight', 86: 'Snow showers: Heavy',
            95: 'Thunderstorm: Slight or moderate', 96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail',
        };

        const conditions = conditionsMap[weathercode] || 'Unknown conditions';
        console.log(`[GraphQL Movie Resolver] Conditions for ${city}: ${conditions}`);
        console.log(`[GraphQL Movie Resolver] Temperature in Fahrenheit: ${temperature}°F`);
        console.log(`[GraphQL Movie Resolver] End of fetching weather for ${city} \n`);

        // Transform data to match our GraphQL Weather type
        return {
            city: city, // Use the city name from the input argument
            temperature: temperature, // Already in Fahrenheit due to API param
            conditions: conditions,
        };
    } catch (error) {
        console.error(`[GraphQL Movie Resolver] Error fetching weather for ${city}:`, error.message);
        throw new Error(`[GraphQL Movie Resolver] Failed to fetch weather for ${city}: ${error.message}`);
    }
};

// Export the weatherResolver function so it can be used in the GraphQL resolvers setup
export default weatherResolver;
