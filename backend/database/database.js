const Database = require("better-sqlite3");

const db = new Database("./database/travel_planner.db");

module.exports = db;