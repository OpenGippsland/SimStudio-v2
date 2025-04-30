import { supabase } from './supabase';

// Users
export async function getUser(id: number) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data || null;
}

export async function createUser(userData: { email: string }) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Credits
export async function getUserCredits(userId: number) {
  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateUserCredits(userId: number, credits: { simulator_hours?: number, coaching_sessions?: number }) {
  // Check if credits exist for this user
  const existingCredits = await getUserCredits(userId);
  
  if (existingCredits) {
    // Update existing credits
    const { data, error } = await supabase
      .from('credits')
      .update(credits)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Create new credits
    const { data, error } = await supabase
      .from('credits')
      .insert({ user_id: userId, ...credits })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Packages
export async function getPackages(activeOnly = true) {
  let query = supabase.from('packages').select('*');
  
  if (activeOnly) {
    query = query.eq('is_active', true);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function getPackage(id: number) {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createPackage(packageData: { name: string, hours: number, price: number, description?: string, is_active?: boolean }) {
  const { data, error } = await supabase
    .from('packages')
    .insert(packageData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePackage(id: number, packageData: { name?: string, hours?: number, price?: number, description?: string, is_active?: boolean }) {
  const { data, error } = await supabase
    .from('packages')
    .update(packageData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Bookings
export async function getBookings(filters: { user_id?: number, start_time_gte?: string, start_time_lte?: string, status?: string } = {}) {
  let query = supabase.from('bookings').select('*');
  
  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }
  
  if (filters.start_time_gte) {
    query = query.gte('start_time', filters.start_time_gte);
  }
  
  if (filters.start_time_lte) {
    query = query.lte('start_time', filters.start_time_lte);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function createBooking(bookingData: { 
  user_id: number, 
  simulator_id: number, 
  start_time: string, 
  end_time: string, 
  coach?: string,
  status?: string,
  booking_type?: string,
  has_coaching?: boolean
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...bookingData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateBooking(id: number, bookingData: {
  start_time?: string,
  end_time?: string,
  coach?: string,
  status?: string,
  cancellation_reason?: string,
  booking_type?: string,
  has_coaching?: boolean
}) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      ...bookingData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Business Hours
export async function getBusinessHours() {
  const { data, error } = await supabase
    .from('business_hours')
    .select('*')
    .order('day_of_week');
  
  if (error) throw error;
  return data || [];
}

export async function updateBusinessHours(dayOfWeek: number, hours: { open_hour?: number, close_hour?: number, is_closed?: boolean }) {
  const { data, error } = await supabase
    .from('business_hours')
    .update(hours)
    .eq('day_of_week', dayOfWeek)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Special Dates
export async function getSpecialDates(filters: { date_gte?: string, date_lte?: string } = {}) {
  let query = supabase.from('special_dates').select('*');
  
  if (filters.date_gte) {
    query = query.gte('date', filters.date_gte);
  }
  
  if (filters.date_lte) {
    query = query.lte('date', filters.date_lte);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function createSpecialDate(specialDateData: { 
  date: string, 
  is_closed?: boolean, 
  open_hour?: number, 
  close_hour?: number, 
  description?: string 
}) {
  const { data, error } = await supabase
    .from('special_dates')
    .insert(specialDateData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSpecialDate(id: number, specialDateData: { 
  is_closed?: boolean, 
  open_hour?: number, 
  close_hour?: number, 
  description?: string 
}) {
  const { data, error } = await supabase
    .from('special_dates')
    .update(specialDateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Coach Availability
export async function getCoachAvailability(coachId?: string) {
  let query = supabase.from('coach_availability').select('*');
  
  if (coachId) {
    query = query.eq('coach_id', coachId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

export async function createCoachAvailability(availabilityData: { 
  coach_id: string, 
  day_of_week: number, 
  start_hour: number, 
  end_hour: number 
}) {
  const { data, error } = await supabase
    .from('coach_availability')
    .insert(availabilityData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCoachAvailability(id: number, availabilityData: { 
  day_of_week?: number, 
  start_hour?: number, 
  end_hour?: number 
}) {
  const { data, error } = await supabase
    .from('coach_availability')
    .update(availabilityData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCoachAvailability(id: number) {
  const { error } = await supabase
    .from('coach_availability')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}
