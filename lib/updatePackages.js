const Database = require('better-sqlite3');
const db = new Database('bookings.db');

// Clear existing packages
db.prepare('DELETE FROM packages').run();

// Create new packages with the requested pricing structure
const packages = [
  { name: 'By the Hour', hours: 1, price: 120, description: 'One hour of simulator time' },
  { name: '5 Hour Pack', hours: 5, price: 550, description: 'Five hours of simulator time at a discounted rate' },
  { name: '10 Hour Pack', hours: 10, price: 1000, description: 'Ten hours of simulator time at a discounted rate' }
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

console.log('Packages updated with new pricing structure');
