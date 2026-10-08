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

app.use(
  cors(
    process.env.CORS_ORIGIN
      ? { origin: process.env.CORS_ORIGIN.split(",") }
      : {}
  )
);
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [users] = await pool
      .promise()
      .query(
        "SELECT id, username, email, password_hash, role FROM users WHERE email = ?",
        [email]
      );
    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Wrong email or password" });
    }
    if (user.role === "banned") {
      return res.status(403).json({ message: "This account is banned" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, lname, username, email, password } = req.body || {};
  if (!name || !lname || !username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool
      .promise()
      .query(
        "INSERT INTO users (first_name, last_name, username, email, password_hash) VALUES (?, ?, ?, ?, ?)",
        [name, lname, username, email, passwordHash]
      );
    res.status(201).json({ message: "Account created" });
  } catch (err) {
    // The users table has UNIQUE constraints on email and username
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "This email or username is already used" });
    }
    console.error("Register failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Any other page URL is a Vue route: let the frontend router handle it
if (hasFrontend) {
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
