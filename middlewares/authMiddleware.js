const jwt = require('jsonwebtoken');
require('dotenv').config();



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // ✅ DECLARE token here

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error("JWT verify failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Admin check
const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
  console.log("req.user.isAdmin:", req.user?.isAdmin);
};

module.exports = { verifyToken, requireAdmin };
