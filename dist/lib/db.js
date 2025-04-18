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

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    simulator_id INTEGER,
    start_time DATETIME,
    end_time DATETIME,
    has_coaching BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'confirmed',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);
export default db;
