import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../lib/db'

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
      
      // Check if user has enough credits
      const bookingHours = Math.ceil((new Date(endTime).getTime() - new Date(startTime).getTime()) / (60 * 60 * 1000))
      
      const userCredits = db.prepare(`
        SELECT simulator_hours FROM credits WHERE user_id = ?
      `).get(Number(userId)) as { simulator_hours: number } | undefined
      
      const availableCredits = userCredits?.simulator_hours || 0
      
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
      
      // Define types for database results
      interface BusinessHours {
        open_hour: number;
        close_hour: number;
        is_closed: number; // SQLite stores booleans as 0/1
      }
      
      interface SpecialDate {
        is_closed: number;
        open_hour: number | null;
        close_hour: number | null;
      }
      
      // Get business hours for the day of week
      const businessHours = db.prepare(
        'SELECT open_hour, close_hour, is_closed FROM business_hours WHERE day_of_week = ?'
      ).get(dayOfWeek) as BusinessHours | undefined;
      
      // Default hours if not configured
      const openHour = businessHours?.open_hour ?? 8;
      const closeHour = businessHours?.close_hour ?? 18;
      const isClosed = businessHours?.is_closed ? true : false;
      
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
      const specialDate = db.prepare(
        'SELECT is_closed, open_hour, close_hour FROM special_dates WHERE date = ?'
      ).get(bookingDate) as SpecialDate | undefined;
      
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

      const stmt = db.prepare(`
        INSERT INTO bookings (user_id, simulator_id, start_time, end_time, coach)
        VALUES (?, ?, ?, ?, ?)
      `)
      
      // Verify user exists first
      const userCheck = db.prepare('SELECT id FROM users WHERE id = ?').get(Number(userId))
      if (!userCheck) {
        return res.status(400).json({ error: 'User does not exist' })
      }

      // Check coach availability if specific coach is selected
      if (coach && coach !== 'none' && coach !== 'any') {
        const dayOfWeek = startDate.getDay();
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        
        // Check if any availability block covers the requested time
        const isAvailable = db.prepare(`
          SELECT 1 FROM coach_availability 
          WHERE coach_id = ? 
          AND day_of_week = ?
          AND (
            (start_hour <= ? AND end_hour >= ?) OR  /* Fully contains */
            (start_hour >= ? AND end_hour <= ?) OR  /* Fully within */
            (start_hour <= ? AND end_hour >= ?)     /* Overlaps start */
          )
        `).get(
          coach, 
          dayOfWeek,
          startHour, endHour,  /* Fully contains */
          startHour, endHour,  /* Fully within */
          startHour, startHour /* Overlaps start */
        );
        
        if (!isAvailable) {
          return res.status(400).json({ error: 'Coach not available at selected time' });
        }

        // Check for existing bookings with this coach
        const existingCoachBooking = db.prepare(`
          SELECT 1 FROM bookings 
          WHERE coach = ? 
          AND ((start_time < ? AND end_time > ?) 
          OR (start_time < ? AND end_time > ?) 
          OR (start_time >= ? AND end_time <= ?))
        `).get(
          coach,
          endDate.toISOString(),
          startDate.toISOString(),
          startDate.toISOString(),
          endDate.toISOString(),
          startDate.toISOString(),
          endDate.toISOString()
        );
        
        if (existingCoachBooking) {
          return res.status(400).json({ error: 'Coach already booked at this time' });
        }
      }

      // Find first available simulator (1-4)
      let availableSimulator = 1;
      const bookedSimulators = db.prepare(`
        SELECT simulator_id FROM bookings
        WHERE ((start_time < ? AND end_time > ?) 
        OR (start_time < ? AND end_time > ?) 
        OR (start_time >= ? AND end_time <= ?))
      `).all(
        endDate.toISOString(),
        startDate.toISOString(),
        startDate.toISOString(),
        endDate.toISOString(),
        startDate.toISOString(),
        endDate.toISOString()
      ).map((b: any) => b.simulator_id);

      while (bookedSimulators.includes(availableSimulator) && availableSimulator <= 4) {
        availableSimulator++;
      }

      if (availableSimulator > 4) {
        return res.status(400).json({ error: 'No available simulators for selected time' });
      }

      // Begin transaction
      db.prepare('BEGIN TRANSACTION').run()
      
      try {
        // Convert data types for SQLite
        const result = stmt.run(
          Number(userId),
          Number(simulatorId),
          new Date(startTime).toISOString(),
          new Date(endTime).toISOString(),
          coach || 'none'
        )
        
        // Deduct credits from user
        db.prepare(`
          UPDATE credits 
          SET simulator_hours = simulator_hours - ? 
          WHERE user_id = ?
        `).run(bookingHours, Number(userId))
        
        // Commit transaction
        db.prepare('COMMIT').run()
        
        // Get updated credits
        const updatedCredits = db.prepare(`
          SELECT simulator_hours FROM credits WHERE user_id = ?
        `).get(Number(userId)) as { simulator_hours: number } | undefined
        
        return res.status(201).json({ 
          id: result.lastInsertRowid,
          creditsRemaining: updatedCredits?.simulator_hours || 0
        })
      } catch (error) {
        // Rollback transaction on error
        db.prepare('ROLLBACK').run()
        throw error
      }
    } 
    else if (req.method === 'GET') {
      const bookings = db.prepare('SELECT * FROM bookings').all()
      return res.status(200).json(bookings)
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
