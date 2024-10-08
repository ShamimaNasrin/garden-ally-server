# Co-Meet

### Live URL: &nbsp; &nbsp; [co-meet.vercel.app](https://co-meet-server.vercel.app/)

## Introduction

Co-Meet is a backend server application for a web platform designed to manage co-working space reservations, specifically tailored for meeting room bookings. This server handles all the backend processes for room management, user interactions, booking schedules, and secure data operations, ensuring a seamless experience for both administrators and users.

## Project Overview

The Co-Meet server is built using Node.js and Express, with MongoDB as its primary database for reliable data storage. This server application provides RESTful APIs that facilitate managing rooms, booking slots, user data, and roles. Designed for scalability, the server ensures fast data retrieval and robust security, making it a reliable solution for co-working space booking systems.

## Key Features

- **Authenticate and authorize**: Authenticate and authorize users and admins through JWT tokens.
- **Room Management**: APIs for CRUD operations on rooms, including details like room number, floor, capacity, amenities, and pricing.
- **Booking Management**: Endpoints for creating, updating, and deleting booking records, allowing users to reserve rooms and time slots.
- **Time Slot Management**: Flexible APIs for setting time slots, including start and end times, to ensure accurate scheduling.
- **Validation**: Strong schema validation using Zod for consistent and reliable data input.

## Technology Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, Zod
- **Authentication**: JWT-based authentication
- **Validation**: Zod for data validation and schema enforcement

## Installation Instructions

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v22.1.0 or higher)
- npm (v10.7.0 or higher)

### Setup and Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ShamimaNasrin/co-meet-server
   cd co-meet-server
   ```

2. **Install Dependencies**:

   ```bash
   npm i
   ```

3. **Create and Configure Environment Variables**:

   Create a `.env` file in the root of the project and add the following environment variables:

   ```bash
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=your-database-url
   BCRYPT_SALT_ROUNDS=number
   JWT_ACCESS_SECRET=your-access-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_ACCESS_EXPIRES_IN=your-preferred-access-expires
   JWT_REFRESH_EXPIRES_IN=your-preferred-refresh-expires
   ```

4. **Run the app**:

   ```bash
   npm run start:dev
   ```

## Usage

- Use the API to manage rooms, time slots, and bookings.
- Authenticate and authorize users and admins through JWT tokens.
- Allow admins to handle room creation, updates, and deletions, as well as manage slot availability.
- Enable users to view room options, check booking statuses, and manage their reservations.
- Process administrative tasks, including updating room details, inventory, and slot schedules.

### Example API Endpoints

- **GET /api/rooms**: Retrieve a list of all rooms.

Make sure to replace credentials on the `.env` file.
