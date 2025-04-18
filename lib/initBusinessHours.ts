import db from './db';

// Initialize business hours with default values (8am-6pm, Monday-Friday)
export function initBusinessHours() {
  console.log('Initializing business hours...');
  
  // Check if business hours are already initialized
  const existingHours = db.prepare('SELECT COUNT(*) as count FROM business_hours').get() as { count: number };
  
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

// Run this function if this file is executed directly
if (require.main === module) {
  initBusinessHours();
}

export default initBusinessHours;
