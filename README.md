# Teacher Session Booking API

A REST API backend for booking teacher sessions built with Node.js, TypeScript, Express.js, MongoDB, and Mongoose.

## Features

- Create users
- Create teacher sessions
- List available sessions for a given date using the MongoDB aggregation pipeline
- Book sessions
- Mark sessions as completed
- Retrieve a user's upcoming and completed sessions using the MongoDB aggregation pipeline
- Centralized error handling and environment-based configuration

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose

## Project Structure

- src/app.ts - Express app setup
- src/server.ts - Server startup
- src/routes - API routes
- src/controllers - Request handlers
- src/models - Mongoose schemas
- src/middleware - Error handling

## Setup Instructions

1. Clone the project and navigate to the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and provide your MongoDB connection string:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. The API will be available at `http://localhost:5000`.

## Environment Variables

- PORT: Server port (default: 5000)
- MONGO_URI: MongoDB connection string
- NODE_ENV: Environment mode

## API Endpoints

### Users

- POST /users - Create a user
- GET /users/:id/sessions - Get upcoming and completed sessions for a user

### Teachers

- POST /teachers - Create a teacher

### Sessions

- POST /sessions - Create a session
- GET /sessions/available?dateTimestamp={timestamp} - Get available sessions for a selected day
- POST /sessions/:id/book - Book a session
- PATCH /sessions/:id/complete - Mark a session as completed

## Postman Collection

Import the collection from [postman/teacher-session-booking-api.postman_collection.json](postman/teacher-session-booking-api.postman_collection.json).
# assignment2
