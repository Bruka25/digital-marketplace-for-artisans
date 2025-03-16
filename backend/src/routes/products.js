const express = require("express");
const pRouter = express.Router();
const pool = require("../config/db");
//const authMiddleware = require("../middleware/jwtauth");

// Add a product
pRouter.post("/", async (req, res) => {
  const { name, description, price, image, category } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, image, category, artisan_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, image, category, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all products
pRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = pRouter;
