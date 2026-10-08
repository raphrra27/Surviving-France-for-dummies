Surviving france for dummies

User test:
email: t@t
passw: test1234

## Running the project on your computer

Install once, in both folders:

    cd server && npm install
    cd surviving-france-for-dummies && npm install

There are two ways to work.

### 1. Local database (default)

Your own data, on your computer. Nothing you do affects the others.

You need MySQL or MariaDB running locally (XAMPP works), with user `root` and no
password. If yours is different, copy `server/.env.example` to `server/.env` and
fill it in.

    cd server
    npm run db:setup     # once: creates the database and the test user
    npm run dev          # the API, restarts when you save server.js

    cd surviving-france-for-dummies
    npm run dev          # the site, on http://localhost:5173

When `server/database.sql` changes, rebuild your local database with
`npm run db:setup -- --reset` (this erases your local data).

### 2. Shared database

The site on your computer talks to the deployed server, so you see the same
accounts and data as everyone. Do not start the API in `server/`.

    cd surviving-france-for-dummies
    npm run dev:shared

Changes to `server/server.js` are not visible in this mode until they are deployed.
