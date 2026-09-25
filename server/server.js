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

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
