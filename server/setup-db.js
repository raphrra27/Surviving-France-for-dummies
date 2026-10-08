// Creates the local development database from database.sql and adds the test user.
//   npm run db:setup              first time
//   npm run db:setup -- --reset   erase the local database and start again
const fs = require("fs");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

try {
  process.loadEnvFile(`${__dirname}/.env`);
} catch {}

const database = "surviving_france"; // the name used inside database.sql
const host = process.env.DB_HOST || "localhost";
const reset = process.argv.includes("--reset");

async function main() {
  // This script creates and can erase a database: never let it touch the shared one
  if (!["localhost", "127.0.0.1", "::1"].includes(host)) {
    console.error(
      `DB_HOST is "${host}", which is not this computer. This script only sets up a local database.\n` +
        "Remove or rename server/.env (or set DB_HOST=localhost) and run it again."
    );
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  if (reset) {
    await connection.query(`DROP DATABASE IF EXISTS \`${database}\``);
    console.log("Old local database erased");
  }

  const [existing] = await connection.query(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'",
    [database]
  );
  if (existing.length > 0) {
    console.log(
      "The local database already exists, nothing changed.\n" +
        "To erase it and start again: npm run db:setup -- --reset"
    );
    await connection.end();
    return;
  }

  await connection.query(fs.readFileSync(`${__dirname}/database.sql`, "utf8"));
  await connection.query(
    `INSERT INTO \`${database}\`.users (first_name, last_name, username, email, password_hash) VALUES (?, ?, ?, ?, ?)`,
    ["Test", "User", "testuser", "t@t", await bcrypt.hash("test1234", 10)]
  );
  await connection.end();
  console.log("Local database ready. Test account: t@t / test1234");
}

main().catch((err) => {
  if (err.code === "ECONNREFUSED") {
    console.error("Cannot reach MySQL on this computer. Is it started?");
  } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
    console.error(
      "MySQL refused the login. Put your local DB_USER and DB_PASSWORD in server/.env (see .env.example)."
    );
  } else {
    console.error("Database setup failed:", err.message);
  }
  process.exit(1);
});
