const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "surviving_france",
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/articles", (req, res) => {
  const query = `
    SELECT id, title, slug, category, cover_image_url, summary, read_time_minutes
    FROM articles
    WHERE status = 'published'
    ORDER BY created_at DESC
  `;

  pool.query(query, (error, rows) => {
    if (error) {
      console.error("Could not load articles:", error);
      return res.status(500).json({ message: "Could not load articles" });
    }

    res.json(rows);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
