import { supabase } from './supabase';

// Initialize business hours with default values (8am-6pm, Monday-Friday)
export async function initBusinessHours() {
  console.log('Initializing business hours...');
  
  // Check if business hours are already initialized
  const { count, error } = await supabase
    .from('business_hours')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error checking business hours:', error);
    return;
  }
  
  if (count && count > 0) {
    console.log('Business hours already initialized');
    return;
  }
  
  // Default business hours: Monday-Friday 8am-6pm, closed on weekends
  const defaultHours = [
    { day_of_week: 0, open_hour: 8, close_hour: 18, is_closed: true }, // Sunday - Closed
    { day_of_week: 1, open_hour: 8, close_hour: 18, is_closed: false }, // Monday
    { day_of_week: 2, open_hour: 8, close_hour: 18, is_closed: false }, // Tuesday
    { day_of_week: 3, open_hour: 8, close_hour: 18, is_closed: false }, // Wednesday
    { day_of_week: 4, open_hour: 8, close_hour: 18, is_closed: false }, // Thursday
    { day_of_week: 5, open_hour: 8, close_hour: 18, is_closed: false }, // Friday
    { day_of_week: 6, open_hour: 8, close_hour: 18, is_closed: true }, // Saturday - Closed
  ];
  
  // Insert default business hours
  const { error: insertError } = await supabase
    .from('business_hours')
    .insert(defaultHours);
  
  if (insertError) {
    console.error('Error initializing business hours:', insertError);
    return;
  }
  
  console.log('Business hours initialized successfully');
}

// Run this function if this file is executed directly
if (require.main === module) {
  initBusinessHours()
    .catch(err => console.error('Error initializing business hours:', err));
}

export default initBusinessHours;
