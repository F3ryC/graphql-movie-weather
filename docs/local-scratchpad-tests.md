# GraphQL Movie Weather API Test Cases

This document contains test cases for the GraphQL Movie Weather API. Use these queries to verify the functionality of various endpoints.

## Basic Query Tests

### Hello World Query
Tests the basic functionality of the GraphQL server.
```graphql
query {
  hello
}
```

### Combined Movie and Weather Query
Tests both movie and weather data retrieval in a single query.
```graphql
query GetMovieAndWeather {
  movie(id: "tt0068646") {  # The Godfather
    title
    year
    director
  }
  weather(city: "Austin") {
    city
    temperature
    conditions
  }
}
```

### Individual Service Tests

#### Movie Query
Tests movie data retrieval only.
```graphql
query {
  movie(id: "tt0133093") {  # The Matrix
    title
    year
  }
}
```

#### Weather Query
Tests weather data retrieval only.
```graphql
query {
  weather(city: "Austin") {
    city
    temperature
  }
}
```

## REST Endpoint Tests

### Movie REST Endpoint
Tests the REST endpoint for movie data:
```http
GET http://localhost:4000/rest/movie/tt0133093
```

### CURL Test Commands
Test the endpoints using CURL in your terminal:

#### Movie Data
```bash
# Get movie details for The Matrix
curl http://localhost:4000/rest/movie/tt0133093

# Get movie details for The Godfather
curl http://localhost:4000/rest/movie/tt0068646
```

#### GraphQL Endpoint
Test the GraphQL endpoint using CURL:
```bash
# Basic hello query
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello }"}' \
  http://localhost:4000/graphql

# Movie query
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ movie(id: \"tt0133093\") { title year } }"}' \
  http://localhost:4000/graphql

# Weather query
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ weather(city: \"Austin\") { city temperature } }"}' \
  http://localhost:4000/graphql
```

## Test IDs Reference
- tt0068646: The Godfather
- tt0133093: The Matrix
