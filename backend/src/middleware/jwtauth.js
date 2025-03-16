const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authMiddleware = async (req, res, next) => {
  // Get the token from the request headers
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token provided. Access denied." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "User not found. Access denied." });
    }

    // Attach the user and token to the request object
    req.user = user.rows[0];
    req.token = token;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token. Access denied." });
  }
};

module.exports = authMiddleware;
