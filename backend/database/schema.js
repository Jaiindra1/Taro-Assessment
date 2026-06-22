const db = require("./database");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    budget_tier TEXT NOT NULL,
    interests TEXT,
    estimated_budget TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS itinerary_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    FOREIGN KEY(trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    itinerary_day_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    estimated_cost REAL,
    time_of_day TEXT,
    FOREIGN KEY(itinerary_day_id) REFERENCES itinerary_days(id)
);

CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    tier TEXT,
    rating TEXT,
    cost_per_night REAL,
    FOREIGN KEY(trip_id) REFERENCES trips(id)
);

CREATE TABLE IF NOT EXISTS packing_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    item TEXT NOT NULL,
    category TEXT,
    is_packed INTEGER DEFAULT 0,
    FOREIGN KEY(trip_id) REFERENCES trips(id)
);
`);

console.log("Database tables created successfully.");