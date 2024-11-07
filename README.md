# Garden Ally

### Live URL: &nbsp; &nbsp; [garden-ally.vercel.app](https://garden-ally-server.vercel.app/)

## Introduction

A backend server application for a web platform dedicated to connecting gardening enthusiasts and professionals. It manages all backend processes, including user profiles, community engagement, content creation, and premium content access. With robust support for user interactions, verified accounts, content upvotes, and secure data handling, Garden Ally ensures a seamless and interactive experience for gardening communities, allowing users to share tips, access exclusive content, and foster connections.

## Table of Contents

- [Features](#key-features)
- [Technologies](#technology-stack)
- [Installation](#installation-instructions)
- [Usage](#usage)

## Key Features

- **User Authentication**: Simple email registration, secure JWT login, with password reset options;

- **User Profile Management**: Editable profile with a "My Profile" section for posts, followers/following; verification available after one upvote via AAMARPAY for premium access and badge display.

- **Post Creation & Sharing**: Creating/editing tips with image uploads, categorized by topics (Vegetables, Flowers, etc.); verified users can mark posts as Premium.

- **Upvote & Downvote System**: Users can upvote/downvote posts to surface top content.

- **Commenting System**: Commenting with edit/delete options.

- **Payment Integration**: Aamarpay for premium content and profile verification payments.

- **News Feed**: Infinite scroll feed with search/filtering; top upvoted content is prioritized.

- **Following System**: User can follow other users for personalized gardening content in the feed.

## Technology Stack

- **Node.js**: Runtime environment for server-side JavaScript, enabling non-blocking, event-driven code.
- **Express**: Web application framework that simplifies routing, middleware management, and API development.
- **MongoDB**: NoSQL database that stores data in flexible, JSON-like documents, ideal for scalable applications.
- **Mongoose**: ODM library for MongoDB, providing schema-based modeling and easy database interaction.
- **Zod**: Schema declaration and validation library for structuring and validating incoming data.
- **JWT**: Token-based authentication mechanism for secure, stateless session management.

## Installation Instructions

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v22.1.0 or higher)
- npm (v10.7.0 or higher)

### Setup and Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ShamimaNasrin/garden-ally-server
   cd garden-ally-server
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

- Use the API to manage user profiles, posts, comments, and community interactions.
- Authenticate and authorize users through JWT tokens for secure access to features.
- Allow admins to moderate posts, manage user accounts, and oversee community standards.
- Enable users to create and share gardening tips, upvote content, comment, and follow others in the community.
- Process premium features, such as verifying user profiles and granting access to exclusive content through secure payment integration.

Make sure to replace credentials on the `.env` file.
