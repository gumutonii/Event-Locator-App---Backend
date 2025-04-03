const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.error("❌ No token provided!");
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    console.log("✅ Received Token:", token);
    console.log("🔑 Expected Secret Key:", process.env.JWT_SECRET);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);
        return res.status(400).json({ message: "Invalid token." });
    }}

module.exports = authenticateToken;
