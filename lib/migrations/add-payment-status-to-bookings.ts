import { supabase } from '../supabase';

export async function addPaymentStatusToBookings() {
  try {
    console.log('Adding payment_status column to bookings table...');
    
    // Check if the column already exists
    const { data: columns, error: checkError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'payment_status'
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
          ADD COLUMN payment_status TEXT DEFAULT NULL
        `
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Successfully added payment_status column to bookings table');
    } else {
      console.log('payment_status column already exists in bookings table');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error adding payment_status column to bookings table:', error);
    return { success: false, error };
  }
}
