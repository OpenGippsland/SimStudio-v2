const db = require('./db').default;
// Clear existing bookings
db.prepare('DELETE FROM bookings').run();
db.prepare('DELETE FROM users').run();
// Create test user
db.prepare('INSERT INTO users (email) VALUES (?)').run('test@simstudio.com');
// Generate random bookings
const simulators = [1, 2, 3, 4];
const days = 7; // Next 7 days
const hours = ['08:00', '10:00', '12:00', '14:00', '16:00']; // Available slots
for (let i = 0; i < 20; i++) {
    const randomDay = Math.floor(Math.random() * days);
    const randomHour = hours[Math.floor(Math.random() * hours.length)];
    const randomSim = simulators[Math.floor(Math.random() * simulators.length)];
    const hasCoaching = Math.random() > 0.7 ? 1 : 0;
    const date = new Date();
    date.setDate(date.getDate() + randomDay);
    const [hour, minute] = randomHour.split(':').map(Number);
    date.setHours(hour, minute, 0, 0);
    const endDate = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour sessions
    db.prepare(`
    INSERT INTO bookings (user_id, simulator_id, start_time, end_time, has_coaching)
    VALUES (?, ?, ?, ?, ?)
  `).run(1, // test user
    randomSim, date.toISOString(), endDate.toISOString(), hasCoaching);
}
console.log('Database seeded with test data');
