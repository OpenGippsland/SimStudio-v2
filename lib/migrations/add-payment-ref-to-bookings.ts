import { supabase } from '../supabase';

export async function addPaymentRefToBookings() {
  try {
    console.log('Adding payment_ref column to bookings table...');
    
    // Check if the column already exists
    const { data: columns, error: checkError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'payment_ref'
      `
    });
    
    if (checkError) {
      throw checkError;
    }
    
    // If column doesn't exist, add it
    if (!columns || !Array.isArray(columns) || columns.length === 0) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE bookings 
          ADD COLUMN payment_ref TEXT DEFAULT NULL
        `
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Successfully added payment_ref column to bookings table');
    } else {
      console.log('payment_ref column already exists in bookings table');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding payment_ref column to bookings table:', error);
    return { success: false, error };
  }
}
