const db = require('./db').default;
const { initBusinessHours } = require('./initBusinessHours');

// Initialize business hours
initBusinessHours();

// Clear existing data
db.prepare('DELETE FROM bookings').run();
db.prepare('DELETE FROM users').run();
db.prepare('DELETE FROM special_dates').run();

// Create test users with different credit amounts
const users = [
  { email: 'test@simstudio.com', credits: 10 },
  { email: 'nocredits@simstudio.com', credits: 0 },
  { email: 'manycredits@simstudio.com', credits: 50 }
];

// Create users and initialize their credits
for (const user of users) {
  const result = db.prepare('INSERT INTO users (email) VALUES (?)').run(user.email);
  const userId = result.lastInsertRowid;
  db.prepare('INSERT OR REPLACE INTO credits (user_id, simulator_hours) VALUES (?, ?)').run(userId, user.credits);
}

// Create sample packages
const packages = [
  { name: 'Single Hour', hours: 1, price: 99.99, description: 'One hour of simulator time' },
  { name: 'Block of 10', hours: 10, price: 899.99, description: 'Ten hours of simulator time at a discounted rate' },
  { name: 'Half Day', hours: 4, price: 349.99, description: 'Four consecutive hours of simulator time' }
];

const packageStmt = db.prepare(`
  INSERT INTO packages (name, hours, price, description, is_active)
  VALUES (?, ?, ?, ?, 1)
`);

for (const pkg of packages) {
  packageStmt.run(
    pkg.name,
    pkg.hours,
    pkg.price,
    pkg.description
  );
}

// Add some special dates
const specialDates = [
  { date: '2025-12-25', isClosed: 1, description: 'Christmas Day' },
  { date: '2025-12-26', isClosed: 1, description: 'Boxing Day' },
  { date: '2025-01-01', isClosed: 1, description: 'New Year\'s Day' },
  { date: '2025-04-25', isClosed: 1, description: 'ANZAC Day' },
  { date: '2025-04-18', isClosed: 0, openHour: 10, closeHour: 16, description: 'Good Friday - Limited Hours' }
];

const specialDateStmt = db.prepare(`
  INSERT INTO special_dates (date, is_closed, open_hour, close_hour, description)
  VALUES (?, ?, ?, ?, ?)
`);

for (const specialDate of specialDates) {
  specialDateStmt.run(
    specialDate.date,
    specialDate.isClosed,
    specialDate.openHour || null,
    specialDate.closeHour || null,
    specialDate.description
  );
}

// Generate random bookings
const simulators = [1, 2, 3, 4];
const days = 7; // Next 7 days
const hours = ['08:00', '10:00', '12:00', '14:00', '16:00']; // Available slots
const coaches = ['none', 'none', 'none', 'CB', 'AD', 'Sarkit']; // More 'none' to make it less frequent

for (let i = 0; i < 20; i++) {
  const randomDay = Math.floor(Math.random() * days);
  const randomHour = hours[Math.floor(Math.random() * hours.length)];
  const randomSim = simulators[Math.floor(Math.random() * simulators.length)];
  const randomCoach = coaches[Math.floor(Math.random() * coaches.length)];
  
  const date = new Date();
  date.setDate(date.getDate() + randomDay);
  const [hour, minute] = randomHour.split(':').map(Number);
  date.setHours(hour, minute, 0, 0);
  
  const endDate = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour sessions

  db.prepare(`
    INSERT INTO bookings (user_id, simulator_id, start_time, end_time, coach, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    1, // test user
    randomSim,
    date.toISOString(),
    endDate.toISOString(),
    randomCoach,
    new Date().toISOString()
  );
}

console.log('Database seeded with test data');
