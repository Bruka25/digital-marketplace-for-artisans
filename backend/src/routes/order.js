const express = require("express");
const oRouter = express.Router();
const pool = require("../config/db");
//const authMiddleware = require("../middleware/jwtauth");

// Place an order
oRouter.post("/", async (req, res) => {
  const { products } = req.body; // Expects an array of product IDs and quantities
  const userId = req.user.id;

  try {
    // Insert the order into the database
    const result = await pool.query(
      "INSERT INTO orders (user_id, products, status) VALUES ($1, $2, $3) RETURNING *",
      [userId, products, "Pending"]
    );

    // Clear the user's cart after placing the order
    await pool.query("DELETE FROM cart WHERE user_id = $1", [userId]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all orders for a user
oRouter.get("/", async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
      userId,
    ]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a specific order by ID
oRouter.get("/:id", async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [orderId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (for admins)
oRouter.put("/:id", async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  // Check if the user is an admin
  if (req.user.role !== "Admin") {
    return res
      .status(403)
      .json({ error: "Only admins can update order status" });
  }

  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = oRouter;
