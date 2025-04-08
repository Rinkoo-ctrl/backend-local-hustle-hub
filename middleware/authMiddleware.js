const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Access Denied" });

    try {
        // Split karke actual token nikaalo
        const token = authHeader.split(" ")[1]; // "Bearer <token>"

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};
