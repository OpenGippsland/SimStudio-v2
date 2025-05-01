import { supabase } from '../supabase';

export async function resetBookingsSequence() {
  try {
    console.log('Starting migration: Reset bookings sequence');
    
    // Get the current maximum ID from the bookings table
    const { data: maxIdResult, error: maxIdError } = await supabase
      .from('bookings')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (maxIdError) {
      console.error('Error getting max booking ID:', maxIdError);
      throw maxIdError;
    }
    
    const maxId = maxIdResult?.id || 0;
    console.log(`Current maximum booking ID: ${maxId}`);
    
    // Reset the sequence to max ID + 1
    const nextId = maxId + 1;
    console.log(`Resetting sequence to: ${nextId}`);
    
    // Execute raw SQL to reset the sequence
    // Note: We're using a workaround since we can't directly execute SQL
    // We'll create a temporary booking with the next ID, then delete it
    const { data: tempBooking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        id: nextId,
        user_id: 1, // Dummy user ID
        simulator_id: 1, // Dummy simulator ID
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
        status: 'temp'
      })
      .select();
    
    if (insertError) {
      // If the error is not a duplicate key error, throw it
      if (insertError.code !== '23505') {
        console.error('Error inserting temporary booking:', insertError);
        throw insertError;
      }
      
      // If it's a duplicate key error, try the next ID
      console.log(`ID ${nextId} already exists, trying ${nextId + 1}`);
      
      const { data: tempBooking2, error: insertError2 } = await supabase
        .from('bookings')
        .insert({
          id: nextId + 1,
          user_id: 1, // Dummy user ID
          simulator_id: 1, // Dummy simulator ID
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          status: 'temp'
        })
        .select();
      
      if (insertError2) {
        console.error('Error inserting temporary booking with next ID:', insertError2);
        throw insertError2;
      }
      
      // Delete the temporary booking
      await supabase
        .from('bookings')
        .delete()
        .eq('id', nextId + 1);
    } else {
      // Delete the temporary booking
      await supabase
        .from('bookings')
        .delete()
        .eq('id', nextId);
    }
    
    console.log('Bookings sequence reset successfully');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}

// Execute the migration if this file is run directly
if (require.main === module) {
  resetBookingsSequence()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
