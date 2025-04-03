require("dotenv").config();
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Import routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const eventRoutes = require('./routes/events');

app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
});

app.use(express.json()); // Middleware to parse JSON requests
app.use('/api', eventRoutes); // Register event routes under '/api'

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

// SQLite Database connection
const sqlite3 = require('sqlite3').verbose();

// Correct path to the database
const dbPath = path.join(__dirname, 'database', 'database.db');  // Make sure path is correct
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
    }
});



