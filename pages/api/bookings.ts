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
      // Convert dates to local timezone for business hour checks
      const localStartDate = new Date(startDate.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
      const localEndDate = new Date(endDate.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
      
      const dayOfWeek = localStartDate.getDay();
      const startHour = localStartDate.getHours();
      const endHour = localEndDate.getHours();
      const endMinute = localEndDate.getMinutes();
      
      console.log('Booking time check:', {
        originalStartDate: startDate.toISOString(),
        originalEndDate: endDate.toISOString(),
        localStartDate: localStartDate.toISOString(),
        localEndDate: localEndDate.toISOString(),
        dayOfWeek,
        startHour,
        endHour,
        endMinute
      });
      
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
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return res.status(400).json({ 
          error: `Bookings not available on ${dayNames[dayOfWeek]}s. The simulator is closed on this day of the week.` 
        });
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
      // Use the local date for special date checks
      const bookingDate = localStartDate.toISOString().split('T')[0];
      
      // Check if it's a special date
      const { data: specialDate, error: specialDateError } = await supabase
        .from('special_dates')
        .select('is_closed, open_hour, close_hour')
        .eq('date', bookingDate)
        .single();
      
      if (specialDate?.is_closed) {
        const formattedDate = new Date(bookingDate).toLocaleDateString('en-AU', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        return res.status(400).json({ 
          error: `Bookings not available on ${formattedDate}. This date is marked as closed in our calendar.` 
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
        // For coach availability, we need to find blocks where:
        // 1. The coach ID matches
        // 2. The day of week matches
        // 3. The coach's available hours cover the requested time slot
        const { data: coachAvailability, error: coachAvailabilityError } = await supabase
          .from('coach_availability')
          .select('*')
          .eq('coach_id', coach)
          .eq('day_of_week', dayOfWeek);
        
        // Manually check if any of the coach's availability blocks cover the requested time
        // We need to check if the coach is available for the entire duration of the booking
        // Use local hours for coach availability check
        const isCoachAvailable = coachAvailability?.some(block => {
          // Check if the coach's availability block covers the entire booking duration
          return block.start_hour <= startHour && block.end_hour >= endHour;
        });
        
        console.log('Coach availability check:', {
          coach,
          dayOfWeek,
          startHour,
          endHour,
          coachAvailability,
          isCoachAvailable
        });
        
        if (!coachAvailability || coachAvailability.length === 0 || !isCoachAvailable) {
          return res.status(400).json({ 
            error: `The selected coach is not available at this time. Please choose a different time or select a different coach.` 
          });
        }

        // Check for existing bookings with this coach
        // We need to find any bookings where:
        // 1. The coach is the same as the requested coach
        // 2. The booking overlaps with the requested time slot
        const { data: existingCoachBookings, error: existingCoachBookingError } = await supabase
          .from('bookings')
          .select('id, start_time, end_time')
          .eq('coach', coach);
        
        // Manually check for overlapping bookings
        const hasOverlap = existingCoachBookings?.some(existingBooking => {
          const existingStart = new Date(existingBooking.start_time);
          const existingEnd = new Date(existingBooking.end_time);
          
          // Convert existing booking times to local timezone for comparison
          const localExistingStart = new Date(existingStart.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
          const localExistingEnd = new Date(existingEnd.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
          
          // Check if there's any overlap between the existing booking and the requested booking
          // An overlap occurs if:
          // 1. The start of the new booking is before the end of the existing booking, AND
          // 2. The end of the new booking is after the start of the existing booking
          return localStartDate < localExistingEnd && localEndDate > localExistingStart;
        });
        
        console.log('Coach booking overlap check:', {
          coach,
          existingCoachBookings,
          hasOverlap
        });
        
        if (hasOverlap) {
          // Format times using the local timezone for display
          const formattedStartTime = localStartDate.toLocaleTimeString('en-AU', { 
            hour: 'numeric', 
            minute: 'numeric',
            hour12: true
          });
          const formattedEndTime = localEndDate.toLocaleTimeString('en-AU', { 
            hour: 'numeric', 
            minute: 'numeric',
            hour12: true
          });
          
          console.log('Coach booking overlap times:', {
            originalStartTime: startDate.toLocaleTimeString(),
            originalEndTime: endDate.toLocaleTimeString(),
            localStartTime: formattedStartTime,
            localEndTime: formattedEndTime
          });
          
          return res.status(400).json({ 
            error: `The selected coach is already booked during the requested time period (${formattedStartTime} - ${formattedEndTime}). Please choose a different time or select a different coach.` 
          });
        }
      }

      // Find first available simulator (1-4)
      // We need to find any bookings that overlap with the requested time slot
      const { data: bookedSimulators, error: bookedSimulatorsError } = await supabase
        .from('bookings')
        .select('simulator_id, start_time, end_time')
        .filter('start_time', 'lt', endDate.toISOString())
        .filter('end_time', 'gt', startDate.toISOString());
      
      // Convert to local time and check for overlaps
      const bookedSimulatorIds = bookedSimulators?.filter(booking => {
        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);
        
        // Convert to local timezone
        const localBookingStart = new Date(bookingStart.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
        const localBookingEnd = new Date(bookingEnd.toLocaleString('en-US', { timeZone: 'Australia/Melbourne' }));
        
        // Check for overlap in local time
        return localStartDate < localBookingEnd && localEndDate > localBookingStart;
      }).map(b => b.simulator_id) || [];
      
      console.log('Simulator availability check:', {
        bookedSimulators,
        bookedSimulatorIds
      });
      
      let availableSimulator = 1;
      while (bookedSimulatorIds.includes(availableSimulator) && availableSimulator <= 4) {
        availableSimulator++;
      }

      if (availableSimulator > 4) {
        // Format times using the local timezone for display
        const formattedTime = localStartDate.toLocaleTimeString('en-AU', { 
          hour: 'numeric', 
          minute: 'numeric',
          hour12: true
        });
        const formattedDate = localStartDate.toLocaleDateString('en-AU', { 
          weekday: 'long', 
          day: 'numeric',
          month: 'long'
        });
        
        console.log('All simulators booked time check:', {
          originalTime: startDate.toLocaleTimeString(),
          localTime: formattedTime,
          originalDate: startDate.toLocaleDateString(),
          localDate: formattedDate
        });
        
        return res.status(400).json({ 
          error: `All simulators are booked at ${formattedTime} on ${formattedDate}. Please select a different time for your booking.` 
        });
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
    else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'Booking ID is required' });
      }
      
      // Handle case where id could be a string or an array of strings
      const bookingIdStr = Array.isArray(id) ? id[0] : id;
      // Convert to number since the database expects a number for the id
      const bookingId = parseInt(bookingIdStr, 10);
      
      if (isNaN(bookingId)) {
        return res.status(400).json({ error: 'Invalid booking ID' });
      }
      
      // Get the booking to check if it exists and to get the user_id and booking hours
      const { data: booking, error: getBookingError } = await supabase
        .from('bookings')
        .select('id, user_id, start_time, end_time')
        .eq('id', bookingId)
        .single();
      
      if (getBookingError) {
        if (getBookingError.code === 'PGRST116') { // No rows returned
          return res.status(404).json({ error: 'Booking not found' });
        }
        throw getBookingError;
      }
      
      // Calculate booking hours to refund
      const startDate = new Date(booking.start_time);
      const endDate = new Date(booking.end_time);
      const bookingHours = Math.ceil((endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000));
      
      // Check if the booking is in the future (can only cancel future bookings)
      const now = new Date();
      if (startDate <= now) {
        return res.status(400).json({ error: 'Cannot cancel bookings that have already started or completed' });
      }
      
      // Delete the booking
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId); // bookingId is already converted to a number above
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Refund the credits to the user
      const { data: userCredits, error: getUserCreditsError } = await supabase
        .from('credits')
        .select('simulator_hours')
        .eq('user_id', booking.user_id) // user_id is already a number in the booking object
        .single();
      
      if (getUserCreditsError) {
        // If we can't get the user credits, we'll still consider the booking cancelled
        console.error('Error getting user credits for refund:', getUserCreditsError);
        return res.status(200).json({ 
          success: true, 
          message: 'Booking cancelled, but credits could not be refunded' 
        });
      }
      
      // Update the user's credits
      const { error: updateCreditsError } = await supabase
        .from('credits')
        .update({ 
          simulator_hours: (userCredits.simulator_hours || 0) + bookingHours 
        })
        .eq('user_id', booking.user_id); // user_id is already a number in the booking object
      
      if (updateCreditsError) {
        // If we can't update the user credits, we'll still consider the booking cancelled
        console.error('Error refunding credits:', updateCreditsError);
        return res.status(200).json({ 
          success: true, 
          message: 'Booking cancelled, but credits could not be refunded' 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Booking cancelled and credits refunded',
        refundedHours: bookingHours
      });
    }
    else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
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
