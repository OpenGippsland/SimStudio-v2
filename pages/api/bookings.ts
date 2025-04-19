import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const { userId, simulatorId, startTime, endTime, coach } = req.body

      // Validate required fields
      if (!userId || !simulatorId || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      
      // Check if user exists and has enough credits
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (userError || !user) {
        return res.status(400).json({ error: 'User does not exist' })
      }
      
      // Calculate booking hours
      const bookingHours = Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / (60 * 60 * 1000))
      
      // Get user credits
      const { data: credits, error: creditsError } = await supabase
        .from('credits')
        .select('simulator_hours')
        .eq('user_id', userId)
        .single();
      
      const availableCredits = credits?.simulator_hours || 0
      
      if (availableCredits < bookingHours) {
        return res.status(400).json({ 
          error: 'Insufficient credits', 
          required: bookingHours,
          available: availableCredits
        })
      }

      // Parse dates
      const startDate = new Date(startTime)
      const endDate = new Date(endTime)
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' })
      }
      if (startDate >= endDate) {
        return res.status(400).json({ error: 'End time must be after start time' })
      }

      // Check if booking is within business hours
      const dayOfWeek = startDate.getDay();
      const startHour = startDate.getHours();
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      
      // Get business hours for the day of week
      const { data: businessHours, error: businessHoursError } = await supabase
        .from('business_hours')
        .select('open_hour, close_hour, is_closed')
        .eq('day_of_week', dayOfWeek)
        .single();
      
      // Default hours if not configured
      const openHour = businessHours?.open_hour ?? 8;
      const closeHour = businessHours?.close_hour ?? 18;
      const isClosed = businessHours?.is_closed || false;
      
      if (isClosed) {
        return res.status(400).json({ error: 'Bookings not available on this day' });
      }
      
      // Check if booking is within business hours
      if (startHour < openHour || 
          endHour > closeHour || 
          (endHour === closeHour && endMinute > 0)) {
        return res.status(400).json({ 
          error: `Bookings must be between ${openHour}am and ${closeHour > 12 ? closeHour - 12 : closeHour}${closeHour >= 12 ? 'pm' : 'am'}` 
        });
      }
      
      // Format date as YYYY-MM-DD for comparison
      const bookingDate = startDate.toISOString().split('T')[0];
      
      // Check if it's a special date
      const { data: specialDate, error: specialDateError } = await supabase
        .from('special_dates')
        .select('is_closed, open_hour, close_hour')
        .eq('date', bookingDate)
        .single();
      
      if (specialDate?.is_closed) {
        return res.status(400).json({ 
          error: 'Bookings not available on this date' 
        });
      }
      
      // If it's a special date with custom hours
      if (specialDate) {
        const specialOpenHour = specialDate.open_hour;
        const specialCloseHour = specialDate.close_hour;
        
        if (specialOpenHour !== null && specialCloseHour !== null) {
          if (startHour < specialOpenHour || 
              endHour > specialCloseHour || 
              (endHour === specialCloseHour && endMinute > 0)) {
            return res.status(400).json({ 
              error: `Bookings on this date must be between ${specialOpenHour}am and ${specialCloseHour > 12 ? specialCloseHour - 12 : specialCloseHour}${specialCloseHour >= 12 ? 'pm' : 'am'}` 
            });
          }
        }
      }
      
      // Check booking window (how far in advance bookings can be made)
      const now = new Date();
      const minBookingTime = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // 2 hours in advance
      const maxBookingTime = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days in advance
      
      if (startDate < minBookingTime) {
        return res.status(400).json({ 
          error: 'Bookings must be made at least 2 hours in advance' 
        });
      }
      
      if (startDate > maxBookingTime) {
        return res.status(400).json({ 
          error: 'Bookings cannot be made more than 30 days in advance' 
        });
      }

      // Check coach availability if specific coach is selected
      if (coach && coach !== 'none' && coach !== 'any') {
        // Check if any availability block covers the requested time
        const { data: coachAvailability, error: coachAvailabilityError } = await supabase
          .from('coach_availability')
          .select('id')
          .eq('coach_id', coach)
          .eq('day_of_week', dayOfWeek)
          .or(`start_hour.lte.${startHour},end_hour.gte.${endHour}`)
          .or(`start_hour.gte.${startHour},end_hour.lte.${endHour}`)
          .or(`start_hour.lte.${startHour},end_hour.gte.${startHour}`);
        
        if (!coachAvailability || coachAvailability.length === 0) {
          return res.status(400).json({ error: 'Coach not available at selected time' });
        }

        // Check for existing bookings with this coach
        const { data: existingCoachBooking, error: existingCoachBookingError } = await supabase
          .from('bookings')
          .select('id')
          .eq('coach', coach)
          .or(`and(start_time.lt.${endDate.toISOString()},end_time.gt.${startDate.toISOString()})`)
          .or(`and(start_time.lt.${startDate.toISOString()},end_time.gt.${endDate.toISOString()})`)
          .or(`and(start_time.gte.${startDate.toISOString()},end_time.lte.${endDate.toISOString()})`);
        
        if (existingCoachBooking && existingCoachBooking.length > 0) {
          return res.status(400).json({ error: 'Coach already booked at this time' });
        }
      }

      // Find first available simulator (1-4)
      const { data: bookedSimulators, error: bookedSimulatorsError } = await supabase
        .from('bookings')
        .select('simulator_id')
        .or(`and(start_time.lt.${endDate.toISOString()},end_time.gt.${startDate.toISOString()})`)
        .or(`and(start_time.lt.${startDate.toISOString()},end_time.gt.${endDate.toISOString()})`)
        .or(`and(start_time.gte.${startDate.toISOString()},end_time.lte.${endDate.toISOString()})`);
      
      const bookedSimulatorIds = bookedSimulators?.map(b => b.simulator_id) || [];
      
      let availableSimulator = 1;
      while (bookedSimulatorIds.includes(availableSimulator) && availableSimulator <= 4) {
        availableSimulator++;
      }

      if (availableSimulator > 4) {
        return res.status(400).json({ error: 'No available simulators for selected time' });
      }

      // Create booking and update credits in a transaction
      // Note: Supabase doesn't support true transactions, but we can handle this with error checking
      
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          simulator_id: simulatorId || availableSimulator,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          coach: coach || 'none',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (bookingError) {
        throw bookingError;
      }
      
      // Update user credits
      const { data: updatedCredits, error: updateCreditsError } = await supabase
        .from('credits')
        .update({ 
          simulator_hours: availableCredits - bookingHours 
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateCreditsError) {
        // If updating credits fails, delete the booking to maintain consistency
        await supabase
          .from('bookings')
          .delete()
          .eq('id', booking.id);
        
        throw updateCreditsError;
      }
      
      return res.status(201).json({ 
        id: booking.id,
        creditsRemaining: updatedCredits.simulator_hours
      });
    } 
    else if (req.method === 'GET') {
      // Get query parameters
      const { userId } = req.query;
      
      let query = supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          simulator_id,
          start_time,
          end_time,
          coach,
          status,
          updated_at,
          cancellation_reason,
          booking_type,
          users (
            email
          )
        `);
      
      // Filter by user if userId is provided
      if (userId) {
        query = query.eq('user_id', typeof userId === 'string' ? parseInt(userId, 10) : parseInt(userId[0], 10));
      }
      
      const { data: bookings, error } = await query.order('start_time', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return res.status(200).json(bookings || []);
    }
    else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Booking API error:', error)
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}
