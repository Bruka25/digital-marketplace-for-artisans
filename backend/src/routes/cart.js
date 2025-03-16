const express = require("express");
const cRouter = express.Router();
const pool = require("../config/db");
//const authMiddleware = require("../middleware/jwtauth");

// Add item to cart
cRouter.post("/", async (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if the product already exists in the cart
    const existingItem = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [userId, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity if the product is already in the cart
      const updatedItem = await pool.query(
        "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *",
        [existingItem.rows[0].quantity + quantity, existingItem.rows[0].id]
      );
      res.json(updatedItem.rows[0]);
    } else {
      // Add new item to the cart
      const newItem = await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [userId, product_id, quantity]
      );
      res.status(201).json(newItem.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch user's cart
cRouter.get("/", async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT cart.*, products.name, products.price, products.image FROM cart JOIN products ON cart.product_id = products.id WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
cRouter.delete("/:id", async (req, res) => {
  const cartItemId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *",
      [cartItemId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = cRouter;
