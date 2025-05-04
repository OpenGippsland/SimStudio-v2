import { Session, SessionsByDate } from './types';

/**
 * Check if a coach is available on a specific date and time
 */
export const isCoachAvailable = (
  coachId: string, 
  dateString: string,
  startHour: number,
  endHour: number,
  coachAvailability: Record<string, any[]>
): boolean => {
  if (coachId === 'any' || coachId === 'none') return true;

  const date = new Date(dateString);
  const dayOfWeek = date.getDay();

  // First check if coach has any availability data
  const coachBlocks = coachAvailability[coachId];
  if (!coachBlocks || !Array.isArray(coachBlocks) || coachBlocks.length === 0) {
    console.log(`No availability blocks found for coach ${coachId}`);
    return false;
  }
  
  // Check if any availability block covers the requested hours
  for (const block of coachBlocks) {
    if (!block) continue;
    
    // Check if this block is for the requested day of week
    if (block.day_of_week !== dayOfWeek) continue;
    
    console.log(`Checking availability for coach ${coachId} on day ${dayOfWeek}: ${block.start_hour}-${block.end_hour} vs requested ${startHour}-${endHour}`);
    
    // Check if this block covers the requested hours
    if (block.start_hour <= startHour && block.end_hour >= endHour) {
      console.log(`Coach ${coachId} is available for ${startHour}-${endHour} on day ${dayOfWeek}`);
      return true;
    }
  }
  
  console.log(`No suitable availability block found for coach ${coachId} on day ${dayOfWeek} for hours ${startHour}-${endHour}`);
  return false;
};

/**
 * Check if a date is closed based on business hours, special dates, and coach availability
 */
export const isDateClosed = (
  dateString: string,
  businessHours: any[],
  specialDates: any[],
  coachAvailability: Record<string, any[]>,
  coach: string
): boolean => {
  // Parse the date
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const formattedDate = dateString.split('T')[0];

  // Check for ANZAC Day (April 25)
  const month = date.getMonth(); // 0-based (3 = April)
  const day = date.getDate();
  if (month === 3 && day === 25) {
    return true;
  }

  // Check if it's a special date
  const specialDate = specialDates.find(sd => sd.date === formattedDate);
  if (specialDate) {
    return specialDate.is_closed === 1;
  }

  // Weekend check (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }

  // For date closed check, we only care if the coach works on this day at all
  // We'll check specific hours later when generating time slots
  if (coach !== 'none' && coach !== 'any') {
    const coachBlocks = coachAvailability[coach];
    
    // Check if coach has any availability blocks for this day
    let worksOnThisDay = false;
    
    if (coachBlocks && Array.isArray(coachBlocks) && coachBlocks.length > 0) {
      for (const block of coachBlocks) {
        if (!block) continue;
        if (block.day_of_week === dayOfWeek) {
          worksOnThisDay = true;
          break;
        }
      }
    }
    
    if (!worksOnThisDay) {
      console.log(`Coach ${coach} does not work on day ${dayOfWeek}, date is closed`);
      return true;
    }
  }

  // Check regular business hours
  const dayHours = businessHours.find(bh => bh.day_of_week === dayOfWeek);
  return dayHours ? dayHours.is_closed === 1 : false;
};

/**
 * Check if a coach is already booked for a specific time slot
 */
export const isCoachBooked = (
  coachId: string, 
  startTime: Date, 
  endTime: Date, 
  existingBookings: any[]
): boolean => {
  if (coachId === 'any' || coachId === 'none') return false;
  
  console.log(`Checking if coach ${coachId} is booked for ${startTime.toISOString()} - ${endTime.toISOString()}`);
  
  const isBooked = existingBookings.some(booking => {
    // Only check bookings for the specified coach
    if (booking.coach !== coachId) return false;
    
    // Convert booking times to Date objects
    const bookingStart = new Date(booking.start_time);
    const bookingEnd = new Date(booking.end_time);
    
    // Check if there's any overlap between the booking and the time slot
    const hasOverlap = startTime < bookingEnd && endTime > bookingStart;
    
    if (hasOverlap) {
      console.log(`Found overlapping booking: ${bookingStart.toISOString()} - ${bookingEnd.toISOString()}`);
    }
    
    return hasOverlap;
  });
  
  console.log(`Coach ${coachId} is ${isBooked ? 'booked' : 'available'} for this time slot`);
  
  return isBooked;
};

/**
 * Generate all sessions for the next 14 days, marking them as available or unavailable
 */
export const generateAvailableSessions = (
  businessHours: any[],
  specialDates: any[],
  coachAvailability: Record<string, any[]>,
  existingBookings: any[],
  formData: {
    hours: number;
    wantsCoach: boolean;
    coach: string;
    coachHours: number;
  }
): SessionsByDate => {
  const sessions: SessionsByDate = {};
  const today = new Date();
  const minBookingTime = new Date(today.getTime() + (2 * 60 * 60 * 1000)); // 2 hours in advance
  const daysToShow = 14; // Show next 14 days
  
  // Check if debug mode is enabled
  const showUnavailableSessions = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_SHOW_UNAVAILABLE_SESSIONS === 'true';
  
  // Generate dates for the next 14 days
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Check if date is closed
    const dateClosed = isDateClosed(dateString, businessHours, specialDates, coachAvailability, formData.coach);
    
    // Skip closed dates if debug mode is off
    if (dateClosed && !showUnavailableSessions) {
      continue;
    }
    
    // Get business hours for this day
    const dayOfWeek = date.getDay();
    const dayHours = businessHours.find(bh => bh.day_of_week === dayOfWeek);
    
    // Default hours if not configured
    const openHour = dayHours?.open_hour ?? 8;
    const closeHour = dayHours?.close_hour ?? 18;
    
    // Initialize time slots array for this date
    const timeSlots: Session[] = [];
    
    // If date is closed and debug mode is on, add a placeholder session to indicate the date is closed
    if (dateClosed) {
      const closedReason = getClosedReason(dateString, businessHours, specialDates, coachAvailability, formData.coach);
      
      // Add a placeholder session for closed dates
      timeSlots.push({
        startTime: `${dateString}T00:00:00.000Z`,
        endTime: `${dateString}T00:00:00.000Z`,
        formattedTime: "Not Available",
        isAvailable: false,
        unavailableReason: closedReason
      });
      
      sessions[dateString] = timeSlots;
      continue;
    }
    
    // Generate time slots for this date
    for (let hour = openHour; hour < closeHour; hour++) {
      // Skip if not enough hours left in the day
      if (hour + formData.hours > closeHour) {
        continue;
      }
      
      // Format the time slot
      const startTime = new Date(dateString);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(dateString);
      endTime.setHours(hour + formData.hours, 0, 0, 0);
      
      // Format time for display (e.g., "9:00 AM - 10:00 AM")
      const formattedStartTime = startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const formattedEndTime = endTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const formattedTime = `${formattedStartTime} - ${formattedEndTime}`;
      
      // Check if this time slot is available
      let isAvailable = true;
      let unavailableReason = '';
      
      // Check if the time slot is at least 2 hours in the future
      if (startTime < minBookingTime) {
        isAvailable = false;
        unavailableReason = 'Bookings must be made at least 2 hours in advance';
      }
      
      // Check coach availability if coach is selected
      if (formData.wantsCoach) {
        // Coach must be available for the entire duration
        const coachEndHour = hour + formData.coachHours;
        
        if (formData.coach !== 'none' && formData.coach !== 'any') {
          // For a specific coach, check if they're available
          if (!isCoachAvailable(formData.coach, dateString, hour, hour + formData.coachHours, coachAvailability)) {
            isAvailable = false;
            unavailableReason = `Coach ${formData.coach} is not available at this time`;
          } else {
            // Calculate the coach's time slot within the simulator session
            const coachStartTime = new Date(startTime);
            const coachEndTime = new Date(coachStartTime);
            coachEndTime.setHours(coachEndTime.getHours() + formData.coachHours);
            
            // Check if the coach is booked during their required time slot
            if (isCoachBooked(formData.coach, coachStartTime, coachEndTime, existingBookings)) {
              isAvailable = false;
              unavailableReason = `Coach ${formData.coach} is already booked during this time slot`;
            }
          }
        } else if (formData.coach === 'any') {
          // For "any" coach, check if at least one coach is available
          // Get all coaches (excluding 'any' and 'none')
          const availableCoaches = Object.keys(coachAvailability).filter(
            coachId => coachId !== 'any' && coachId !== 'none'
          );
          
          // Calculate the coach's time slot within the simulator session
          const coachStartTime = new Date(startTime);
          const coachEndTime = new Date(coachStartTime);
          coachEndTime.setHours(coachEndTime.getHours() + formData.coachHours);
          
          // Check if at least one coach is available and not booked
          const atLeastOneCoachAvailable = availableCoaches.some(coachId => {
            // First check if coach is available on this day of week
            if (!isCoachAvailable(coachId, dateString, hour, hour + formData.coachHours, coachAvailability)) {
              return false; // Coach isn't available on this day
            }
            
            // Then check if coach is not already booked
            return !isCoachBooked(coachId, coachStartTime, coachEndTime, existingBookings);
          });
          
          if (!atLeastOneCoachAvailable) {
            isAvailable = false;
            unavailableReason = 'No coaches are available for this time slot';
          }
        }
      }
      
      // Check simulator availability
      const simulatorStartTime = new Date(startTime);
      const simulatorEndTime = new Date(endTime);
      
      // Check if all simulators are booked for this time slot
      const bookedSimulators = existingBookings
        .filter(booking => {
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);
          return (simulatorStartTime < bookingEnd && simulatorEndTime > bookingStart);
        })
        .map(b => b.simulator_id);
      
      // If all 4 simulators are booked, mark as unavailable
      if (bookedSimulators.length >= 4) {
        isAvailable = false;
        unavailableReason = 'All simulators are booked for this time slot';
      }
      
      // Only add unavailable time slots if debug mode is on
      if (isAvailable || showUnavailableSessions) {
        timeSlots.push({
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          formattedTime,
          isAvailable,
          unavailableReason: isAvailable ? undefined : unavailableReason
        });
      }
    }
    
    // Add all dates, even if they have no available sessions
    sessions[dateString] = timeSlots;
  }
  
  return sessions;
};

/**
 * Get the reason why a date is closed
 */
const getClosedReason = (
  dateString: string,
  businessHours: any[],
  specialDates: any[],
  coachAvailability: Record<string, any[]>,
  coach: string
): string => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  const formattedDate = dateString.split('T')[0];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Check for ANZAC Day (April 25)
  const month = date.getMonth(); // 0-based (3 = April)
  const day = date.getDate();
  if (month === 3 && day === 25) {
    return 'Closed for ANZAC Day';
  }
  
  // Check if it's a special date
  const specialDate = specialDates.find(sd => sd.date === formattedDate);
  if (specialDate && specialDate.is_closed === 1) {
    return specialDate.description || 'Closed for special event';
  }
  
  // Weekend check (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return `Closed on ${dayNames[dayOfWeek]}s`;
  }
  
  // Check coach availability
  if (coach !== 'none' && coach !== 'any') {
    const coachBlocks = coachAvailability[coach];
    let worksOnThisDay = false;
    
    if (coachBlocks && Array.isArray(coachBlocks) && coachBlocks.length > 0) {
      for (const block of coachBlocks) {
        if (!block) continue;
        if (block.day_of_week === dayOfWeek) {
          worksOnThisDay = true;
          break;
        }
      }
    }
    
    if (!worksOnThisDay) {
      return `Coach ${coach} is not available on ${dayNames[dayOfWeek]}s`;
    }
  }
  
  // Check regular business hours
  const dayHours = businessHours.find(bh => bh.day_of_week === dayOfWeek);
  if (dayHours && dayHours.is_closed === 1) {
    return `Closed on ${dayNames[dayOfWeek]}s`;
  }
  
  return 'Not available';
};

/**
 * Format session details for display in confirmation
 */
export const formatSessionDetails = (
  selectedSession: Session | null,
  formData: {
    hours: number;
    wantsCoach: boolean;
    coach: string;
    coachHours: number;
  }
) => {
  if (!selectedSession) return null;
  
  const startDate = new Date(selectedSession.startTime);
  const endDate = new Date(selectedSession.endTime);
  
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedStartTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const formattedEndTime = endDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return {
    date: formattedDate,
    time: `${formattedStartTime} - ${formattedEndTime}`,
    hours: formData.hours,
    coach: formData.wantsCoach ? formData.coach : 'None',
    coachHours: formData.coachHours
  };
};
