const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

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

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

const avatarTypes = { "image/png": ".png", "image/jpeg": ".jpg" };
const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) =>
      cb(null, crypto.randomUUID() + avatarTypes[file.mimetype]),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (avatarTypes[file.mimetype]) return cb(null, true);
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  },
}).single("avatar");

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
        "SELECT id, username, email, password_hash, role, avatar_url FROM users WHERE email = ?",
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
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    console.error("Login failed:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/register", (req, res) => {
  uploadAvatar(req, res, async (uploadErr) => {
    if (uploadErr) {
      const message =
        uploadErr.code === "LIMIT_FILE_SIZE"
          ? "Profile picture must be 2 MB or less"
          : "Profile picture must be a PNG or JPEG image";
      return res.status(400).json({ message });
    }

    const removeAvatar = () => {
      if (req.file) fs.unlink(req.file.path, () => {});
    };

    const { name, lname, username, email, password } = req.body || {};
    if (!name || !lname || !username || !email || !password) {
      removeAvatar();
      return res.status(400).json({ message: "Missing fields" });
    }
    if (password.length < 8) {
      removeAvatar();
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const avatarUrl = req.file ? `/uploads/${req.file.filename}` : null;
      await pool
        .promise()
        .query(
          "INSERT INTO users (first_name, last_name, username, email, password_hash, avatar_url) VALUES (?, ?, ?, ?, ?, ?)",
          [name, lname, username, email, passwordHash, avatarUrl]
        );
      res.status(201).json({ message: "Account created" });
    } catch (err) {
      removeAvatar();
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ message: "This email or username is already used" });
      }
      console.error("Register failed:", err.message);
      res.status(500).json({ message: "Server error" });
    }
  });
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


app.get("/articles/:slug", (req, res) => {
  const query = `
    SELECT
      articles.id,
      articles.title,
      articles.slug,
      articles.category,
      articles.cover_image_url,
      articles.summary,
      articles.content,
      articles.read_time_minutes,
      articles.updated_at,
      users.username AS author_username
    FROM articles
    JOIN users ON users.id = articles.author_id
    WHERE articles.slug = ? AND articles.status = 'published'
  `;

  pool.query(query, [req.params.slug], (error, rows) => {
    if (error) {
      console.error("Could not load article:", error);
      return res.status(500).json({ message: "Could not load article" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(rows[0]);
  });
});



app.post("/articles/:id/progress", (req, res) => {
  const userId = 1; // temporaire pour le test
  const articleId = req.params.id;

  const query = `
    INSERT INTO article_progress (
      user_id,
      article_id,
      percent_read,
      completed
    ) VALUES (?, ?, 100, TRUE)
    ON DUPLICATE KEY UPDATE
      percent_read = 100,
      completed = TRUE,
      last_read_at = CURRENT_TIMESTAMP
  `;

  pool.query(query, [userId, articleId], (error) => {
    if (error) {
      console.error("Could not mark as read:", error);
      return res.status(500).json({
        message: "Could not mark as read",
      });
    }

    res.json({
      message: "Article marked as read",
    });
  });
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
