// This script migrates data from SQLite to Supabase
const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// SQLite database
const sqliteDb = new Database('bookings.db');

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  try {
    console.log('Starting migration from SQLite to Supabase...');
    
    // Check if data already exists in Supabase
    const { data: existingUsers } = await supabase.from('users').select('id').limit(1);
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('Data already exists in Supabase. Clearing tables before migration...');
      
      // Clear existing data in reverse order of dependencies
      await supabase.from('bookings').delete().neq('id', 0);
      await supabase.from('credits').delete().neq('user_id', 0);
      await supabase.from('coach_availability').delete().neq('id', 0);
      await supabase.from('business_hours').delete().neq('id', 0);
      await supabase.from('special_dates').delete().neq('id', 0);
      await supabase.from('packages').delete().neq('id', 0);
      await supabase.from('users').delete().neq('id', 0);
      
      console.log('Existing data cleared.');
    }
    
    // Migrate users
    console.log('Migrating users...');
    const users = sqliteDb.prepare('SELECT * FROM users').all();
    if (users.length > 0) {
      const { error: usersError } = await supabase.from('users').insert(users);
      if (usersError) throw usersError;
      console.log(`Migrated ${users.length} users`);
    }
    
    // Migrate credits
    console.log('Migrating credits...');
    const credits = sqliteDb.prepare('SELECT * FROM credits').all();
    if (credits.length > 0) {
      const { error: creditsError } = await supabase.from('credits').insert(credits);
      if (creditsError) throw creditsError;
      console.log(`Migrated ${credits.length} credit records`);
    }
    
    // Migrate packages
    console.log('Migrating packages...');
    const packages = sqliteDb.prepare('SELECT * FROM packages').all();
    if (packages.length > 0) {
      const { error: packagesError } = await supabase.from('packages').insert(packages);
      if (packagesError) throw packagesError;
      console.log(`Migrated ${packages.length} packages`);
    }
    
    // Migrate coach_availability
    console.log('Migrating coach availability...');
    const coachAvailability = sqliteDb.prepare('SELECT * FROM coach_availability').all();
    if (coachAvailability.length > 0) {
      const { error: coachAvailabilityError } = await supabase.from('coach_availability').insert(coachAvailability);
      if (coachAvailabilityError) throw coachAvailabilityError;
      console.log(`Migrated ${coachAvailability.length} coach availability records`);
    }
    
    // Migrate bookings
    console.log('Migrating bookings...');
    const bookings = sqliteDb.prepare('SELECT * FROM bookings').all();
    if (bookings.length > 0) {
      const { error: bookingsError } = await supabase.from('bookings').insert(bookings);
      if (bookingsError) throw bookingsError;
      console.log(`Migrated ${bookings.length} bookings`);
    }
    
    // Migrate business_hours
    console.log('Migrating business hours...');
    const businessHours = sqliteDb.prepare('SELECT * FROM business_hours').all();
    if (businessHours.length > 0) {
      const { error: businessHoursError } = await supabase.from('business_hours').insert(businessHours);
      if (businessHoursError) throw businessHoursError;
      console.log(`Migrated ${businessHours.length} business hours records`);
    }
    
    // Migrate special_dates
    console.log('Migrating special dates...');
    const specialDates = sqliteDb.prepare('SELECT * FROM special_dates').all();
    if (specialDates.length > 0) {
      const { error: specialDatesError } = await supabase.from('special_dates').insert(specialDates);
      if (specialDatesError) throw specialDatesError;
      console.log(`Migrated ${specialDates.length} special dates`);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    sqliteDb.close();
  }
}

migrateData();
