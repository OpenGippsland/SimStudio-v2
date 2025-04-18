import Database from 'better-sqlite3';

const db = new Database('bookings.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shopify_id TEXT UNIQUE,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS credits (
    user_id INTEGER PRIMARY KEY,
    simulator_hours INTEGER DEFAULT 0,
    coaching_sessions INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    hours INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
  );

  CREATE TABLE IF NOT EXISTS coach_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id TEXT NOT NULL,
    day_of_week INTEGER NOT NULL, /* 0-6 (Sunday-Saturday) */
    start_hour INTEGER NOT NULL, /* 0-23 */
    end_hour INTEGER NOT NULL, /* 0-23 */
    UNIQUE(coach_id, day_of_week, start_hour)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    simulator_id INTEGER,
    start_time DATETIME,
    end_time DATETIME,
    coach TEXT DEFAULT 'none',
    status TEXT DEFAULT 'confirmed',
    updated_at DATETIME,
    cancellation_reason TEXT,
    booking_type TEXT DEFAULT 'single',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS business_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week INTEGER NOT NULL, /* 0-6 (Sunday-Saturday) */
    open_hour INTEGER NOT NULL DEFAULT 8,
    close_hour INTEGER NOT NULL DEFAULT 18,
    is_closed BOOLEAN DEFAULT FALSE,
    UNIQUE(day_of_week)
  );

  CREATE TABLE IF NOT EXISTS special_dates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL UNIQUE,
    is_closed BOOLEAN DEFAULT TRUE,
    open_hour INTEGER,
    close_hour INTEGER,
    description TEXT
  );
`);

export default db;
