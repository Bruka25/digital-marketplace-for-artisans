const express = require("express");
const pRouter = express.Router();
const pool = require("../config/db");
const path = require("path");
const multer = require("multer");
//const authMiddleware = require("../middleware/jwtauth");

// Serve static files from the "uploads" directory
pRouter.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

pRouter.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, image, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, price, image, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
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
