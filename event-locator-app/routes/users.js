const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const auth = require('../middleware/auth');  

const User = require("../routes/users"); 
const jwt = require('jsonwebtoken');


router.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ message: "Server error" });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token ONLY ONCE
        if (!req.headers.authorization) {
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
            return res.json({ message: "Login successful", token });
        }

        // Return user data instead of regenerating token
        res.json({ id: user.id, email: user.email, name: user.name });
    });


    


    // Find user in database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token ONLY IF user is logging in
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});



// Register new user
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;


    router.get('/', auth, (req, res) => {
        res.json({ message: 'Authenticated request successful!' });
    });

    // Check if user already exists
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (row) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }

            // Insert the new user into the database
            db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Error saving user' });
                }

                // Return the created user and a success message
                const newUser = { id: this.lastID, name, email };
                res.status(201).json({
                    message: 'User created successfully',
                    user: newUser
                });
            });
        });
    });
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!match) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

            // Send the token to the client
            res.json({
                message: 'Login successful',
                token: token
            });
        });
    });
});

// Get all users
router.get('/users', async (req, res) => {
    const sql = "SELECT * FROM users";  

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err);  
            return res.status(500).json({ message: "Database error" });
        }
        console.log("Fetched users:", rows); 
        res.json(rows); 
    });
});


// Update User (Update)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`;
        await db.run(sql, [name, email, hashedPassword, id]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

// Delete User (Delete)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
