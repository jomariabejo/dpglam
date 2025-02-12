# MO-IT149 - Web Technology Application

## Overview
This document outlines the integration plan for third-party APIs within the functional web application, ensuring seamless CRUD operations and API interactions.

## Project Structure

### 1. Client
The frontend will dynamically fetch and display third-party API data while enabling CRUD operations.
- **`client/src/components`** – Reusable components that can be use in any vuejs file.
- **`client/router/index.js`** –  Official client-side routing solution for Vue.
- **`client/services/auth.js`** – Provides utility functions for handling user authentication, including storing, retrieving, and removing JWT tokens from local storage. It also decodes the JWT to extract user details such as role, email, and username, enabling role-based access control and authentication checks.
- **`client/views`** – Directory contains components that represent different pages in the application. These components integrate API data with CRUD operations and provide an interactive user experience.
.

### 2. Server
The backend handles API requests, processes data, and interacts with the database.
- **`server/middleware`** – Main backend server file managing API endpoints and CRUD logic.
- **`server/models`** – Defines API endpoints for fetching and storing external data.
- **`server/routes`** – Defines the database schema for storing API-integrated records.
- **`server/test`** – Manages API calls, data validation, and CRUD operations.


## API Integration Plan

### Selected API
- **API Name:** FakeStore
- **Base URL:** `https://fakestoreapi.com/`
- **Endpoints:**
  - `GET /data` – Fetch API data.

## Error Handling
- Implement try-catch blocks for API requests.
- Display user-friendly error messages for failed requests.
- Handle cases where API responses are invalid or missing required fields.

## Testing Plan
- **Postman Tests:** Verify API responses and CRUD functionality.

## Setup Instructions
1. Clone the repository:  
   ```sh
   https://github.com/jomariabejo/dpglam/
   ```
2. Install dependencies for client/server:  
   ```sh
   npm install
   ```
4. Start the backend server:  
   ```sh
   node server.js
   ```
5. Start the frontend application:  
   ```sh
   npm run dev
   ```
6. Some API endpoints using Postman.
### Register new user
http://localhost:5000/api/auth/register
```json
{
    "username": "shadowMonarch",
    "email": "arise@gmail.com",
    "password": "igris"
}
```
### Login user
http://localhost:5000/api/auth/login
```json
{
    "email": "shadowMonarch",
    "password": "igris"
}
```
### Delete account
To test this in postman follow the following:
http://localhost:5000/api/auth/admin/users/yourId

## Conclusion
This Unified API Plan ensures that the integration of third-party APIs aligns with existing CRUD operations, enhancing the functionality and interactivity of the web application.

