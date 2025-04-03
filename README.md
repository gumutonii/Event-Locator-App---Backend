# Event Locator App - Backend

## Project Overview
The **Event Locator App** is a multi-user event discovery platform designed to help users find and manage events based on location and personal preferences. This backend is built using **Node.js, Express.js, and SQLite**, handling authentication, event management, and user interactions.

## 🚀 Features
- **User Authentication**: JWT-based authentication for secure access.
- **Event Management**: CRUD operations for creating, reading, updating, and deleting events.
- **User Preferences**: Personalized event recommendations.
- **Geospatial Data Handling**: Location-based event discovery.
- **Asynchronous Tasks**: Optimized API performance.
- **Testing**: Unit testing for API endpoints.

## 🏗️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest / Mocha & Chai

## 🔧 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/gumutoni/event-locator-app-backend.git
cd event-locator-app
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file and configure it as follows:
```
PORT=5500
JWT_SECRET=your_secret_key
DATABASE_URL=./database.sqlite
```

### 4️⃣ Run Migrations (If using a migration tool)
```bash
npm run migrate
```

### 5️⃣ Start the Server
```bash
node server.js
```

## 📌 API Endpoints
### 🔑 Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and receive a JWT token

### 📅 Events
- `POST /api/events` - Create an event (Auth required)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a single event
- `PUT /api/events/:id` - Update an event (Auth required)
- `DELETE /api/events/:id` - Delete an event (Auth required)

### 👤 Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## ✅ Testing the API
You can use **Postman** or **cURL** to test the endpoints.

## 🛠️ Troubleshooting
### ❌ JWT Verification Error: "invalid signature"
- Ensure `JWT_SECRET` in `.env` matches the key used to sign tokens.
- Restart the server after changing `.env`.



Made by Gentille Umutoni

