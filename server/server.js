const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Optional server/.env file (see .env.example); defaults below target a local setup
try {
  process.loadEnvFile(`${__dirname}/.env`);
} catch {}

const app = express();

app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN.split(",") } : {}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// When the frontend has been built, serve it too so one process runs the whole site
const distDir = path.join(__dirname, "../surviving-france-for-dummies/dist");
const hasFrontend = fs.existsSync(path.join(distDir, "index.html"));
if (hasFrontend) {
  app.use(express.static(distDir));
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "surviving_france",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to the database");
    connection.release();
  }
});

const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

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
