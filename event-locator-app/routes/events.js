const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth'); 
const db = require('../config/db');
const authenticateToken = require('../middleware/auth'); 


// POST /api/events - Create a new event
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        const userId = req.user.id; 

        if (!userId) {
            return res.status(400).json({ message: "User is missing in request." });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            user: userId 
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});




router.get('/events', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if (err) {
            console.error("Error fetching events:", err.message);
            return res.status(500).json({ message: "Server error", error: err.message });
        }
        res.json(rows);
    });
});



// Update Event
router.put("/:id", authenticateToken, async (req, res) => {
    const eventId = req.params.id;
    const { name, date, location, description } = req.body;
    
    try {
        const result = await db.run(
            "UPDATE events SET name = ?, date = ?, location = ?, description = ? WHERE id = ?",
            [name, date, location, description, eventId]
        );

        if (result.changes === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully" });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// Delete Event
router.delete("/:id", authenticateToken, async (req, res) => {
    const eventId = req.params.id;

    try {
        const result = await db.run("DELETE FROM events WHERE id = ?", [eventId]);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;