const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'event_locator.db'), (err) => {
    if (err) {
        console.error("❌ Failed to connect to the database:", err.message);
        process.exit(1);
    }
    console.log("✅ Connected to SQLite database.");
});

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
        console.error("❌ Error fetching tables:", err.message);
        process.exit(1);
    }
    console.log("✅ Tables:", tables);
});

db.close();
