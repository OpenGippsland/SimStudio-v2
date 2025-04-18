const Database = require('better-sqlite3');
const db = new Database('bookings.db');

// Initialize business hours
function initBusinessHours() {
  console.log('Initializing business hours...');
  
  // Check if business hours are already initialized
  const existingHours = db.prepare('SELECT COUNT(*) as count FROM business_hours').get();
  
  if (existingHours.count > 0) {
    console.log('Business hours already initialized');
    return;
  }
  
  // Default business hours: Monday-Friday 8am-6pm, closed on weekends
  const defaultHours = [
    { dayOfWeek: 0, openHour: 8, closeHour: 18, isClosed: 1 }, // Sunday - Closed
    { dayOfWeek: 1, openHour: 8, closeHour: 18, isClosed: 0 }, // Monday
    { dayOfWeek: 2, openHour: 8, closeHour: 18, isClosed: 0 }, // Tuesday
    { dayOfWeek: 3, openHour: 8, closeHour: 18, isClosed: 0 }, // Wednesday
    { dayOfWeek: 4, openHour: 8, closeHour: 18, isClosed: 0 }, // Thursday
    { dayOfWeek: 5, openHour: 8, closeHour: 18, isClosed: 0 }, // Friday
    { dayOfWeek: 6, openHour: 8, closeHour: 18, isClosed: 1 }, // Saturday - Closed
  ];
  
  const stmt = db.prepare(`
    INSERT INTO business_hours (day_of_week, open_hour, close_hour, is_closed)
    VALUES (?, ?, ?, ?)
  `);
  
  // Insert default business hours
  const insertMany = db.transaction((hours) => {
    for (const hour of hours) {
      stmt.run(hour.dayOfWeek, hour.openHour, hour.closeHour, hour.isClosed);
    }
  });
  
  insertMany(defaultHours);
  console.log('Business hours initialized successfully');
}

// Initialize business hours
initBusinessHours();

// Clear existing data
db.prepare('DELETE FROM bookings').run();
db.prepare('DELETE FROM credits').run();
db.prepare('DELETE FROM users').run();
db.prepare('DELETE FROM special_dates').run();
db.prepare('DELETE FROM packages').run();

// Create test users with different credit amounts
const users = [
  { email: 'test@simstudio.com', credits: 10 },
  { email: 'nocredits@simstudio.com', credits: 0 },
  { email: 'manycredits@simstudio.com', credits: 50 },
  { email: 'student@simstudio.com', credits: 5 },
  { email: 'instructor@simstudio.com', credits: 25 }
];

// Insert users and their credits
const insertUser = db.prepare('INSERT INTO users (email) VALUES (?)');
const insertCredits = db.prepare('INSERT INTO credits (user_id, simulator_hours) VALUES (?, ?)');

let firstUserId = null;
for (const user of users) {
  const { lastInsertRowid: userId } = insertUser.run(user.email);
  insertCredits.run(userId, user.credits);
  
  // Store the first user ID for bookings
  if (firstUserId === null) {
    firstUserId = userId;
  }
}

// Create sample packages
const packages = [
  { name: 'Single Hour', hours: 1, price: 99.99, description: 'One hour of simulator time' },
  { name: 'Block of 10', hours: 10, price: 899.99, description: 'Ten hours of simulator time at a discounted rate' },
  { name: 'Half Day', hours: 4, price: 349.99, description: 'Four consecutive hours of simulator time' },
  { name: 'Full Day', hours: 8, price: 649.99, description: 'Eight consecutive hours of simulator time' },
  { name: 'Trial Package', hours: 2, price: 149.99, description: 'Two hours for new customers' }
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

  // Check which columns exist in bookings table
  const tableInfo = db.prepare("PRAGMA table_info(bookings)").all();
  const hasUpdatedAt = tableInfo.some(column => column.name === 'updated_at');
  const hasCoach = tableInfo.some(column => column.name === 'coach');
  const hasHasCoaching = tableInfo.some(column => column.name === 'has_coaching');
  
  if (hasCoach) {
    // New schema with coach column
    if (hasUpdatedAt) {
      db.prepare(`
        INSERT INTO bookings (user_id, simulator_id, start_time, end_time, coach, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        firstUserId,
        randomSim,
        date.toISOString(),
        endDate.toISOString(),
        randomCoach,
        new Date().toISOString()
      );
    } else {
      db.prepare(`
        INSERT INTO bookings (user_id, simulator_id, start_time, end_time, coach)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        firstUserId,
        randomSim,
        date.toISOString(),
        endDate.toISOString(),
        randomCoach
      );
    }
  } else if (hasHasCoaching) {
    // Old schema with has_coaching column
    const hasCoaching = randomCoach !== 'none' ? 1 : 0;
    db.prepare(`
      INSERT INTO bookings (user_id, simulator_id, start_time, end_time, has_coaching)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      firstUserId,
      randomSim,
      date.toISOString(),
      endDate.toISOString(),
      hasCoaching
    );
  } else {
    // Fallback with minimal columns
    db.prepare(`
      INSERT INTO bookings (user_id, simulator_id, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `).run(
      firstUserId,
      randomSim,
      date.toISOString(),
      endDate.toISOString()
    );
  }
}

console.log('Database seeded with test data');
