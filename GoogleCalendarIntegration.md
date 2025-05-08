# Google Calendar Integration for SimStudio

## Implementation Time Estimate

Even with AI generating most of the code, implementing the Google Calendar integration will require several steps that take human time. Here's a breakdown:

### One-time Setup (60-90 minutes)
- Creating Google Cloud project: 10-15 minutes
- Enabling APIs and creating service account: 10-15 minutes
- Setting up calendars and sharing permissions: 20-30 minutes
- Adding environment variables to your project: 10-15 minutes
- Database migration for new columns: 10-15 minutes

### Code Implementation (90-120 minutes)
- Creating the Google Calendar integration module: 30-45 minutes (mostly reviewing and adapting the AI-generated code)
- Integrating with booking API endpoints: 30-45 minutes
- Testing and debugging: 30 minutes

### Total Estimated Time: 2.5-3.5 hours (150-210 minutes)

# Google Calendar Integration for SimStudio

This document outlines the implementation plan for integrating Google Calendar with the SimStudio booking system to provide automated notifications for bookings, cancellations, and updates.

## Overview

The integration will use Google Calendar API to:

1. Create calendar events when bookings are made
2. Update calendar events when bookings are modified
3. Delete calendar events when bookings are cancelled
4. Provide separate calendars for admin overview, individual simulators, and coaches

## Setup Process

### 1. Google Cloud Project Setup

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Click on the project dropdown at the top of the page
   - Click "New Project"
   - Enter a name (e.g., "SimStudio Booking System")
   - Click "Create"

2. **Enable the Google Calendar API**:
   - In your new project, go to the navigation menu (≡)
   - Select "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on the Calendar API result
   - Click "Enable"

3. **Create a Service Account**:
   - In the navigation menu, go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Enter a name (e.g., "SimStudio Calendar Service")
   - Add a description (e.g., "Service account for managing booking calendars")
   - Click "Create and Continue"
   - For role, select "Basic" > "Editor" (or a more restrictive role if preferred)
   - Click "Continue" and then "Done"

4. **Create and Download Service Account Key**:
   - From the service accounts list, click on your new service account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select "JSON" format
   - Click "Create"
   - The key file will download automatically - keep this secure!

### 2. Calendar Setup

1. **Create Admin Calendar**:
   - Go to [Google Calendar](https://calendar.google.com/)
   - Click the "+" next to "Other calendars"
   - Select "Create new calendar"
   - Name it "SimStudio Bookings"
   - Add a description and set the timezone to Australia/Melbourne
   - Click "Create calendar"

2. **Create Simulator Calendars**:
   - Create a separate calendar for each simulator (e.g., "SimStudio - Simulator 1")
   - Repeat for all four simulators

3. **Share Calendars with Service Account**:
   - For each calendar:
     - Click the three dots next to the calendar name
     - Select "Settings and sharing"
     - Under "Share with specific people," click "Add people"
     - Enter your service account email (ends with @project-id.iam.gserviceaccount.com)
     - Set permission to "Make changes to events"
     - Click "Send"

4. **Share Calendars with Admin**:
   - For each calendar:
     - Under "Share with specific people," click "Add people"
     - Enter the admin's email (e.g., chris@simstudio.com.au)
     - Set permission to "Make changes to events"
     - Click "Send"

5. **For Coaches**:
   - For internal coaches (like Chris who is also an admin):
     - Share the relevant calendars with their email
   - For external coaches (like Shane):
     - Option 1: Create a dedicated calendar for each coach and share it with them
     - Option 2: Use calendar invites for each booking (recommended for external coaches)

## Implementation

### 1. Environment Variables

Add these to your `.env` file and deployment environment:

```
# Google Calendar API credentials
GOOGLE_CLIENT_EMAIL=service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# Admin calendar
ADMIN_CALENDAR_ID=admin-calendar-id@group.calendar.google.com

# Simulator-specific calendars
SIMULATOR_1_CALENDAR_ID=simulator1-calendar-id@group.calendar.google.com
SIMULATOR_2_CALENDAR_ID=simulator2-calendar-id@group.calendar.google.com
SIMULATOR_3_CALENDAR_ID=simulator3-calendar-id@group.calendar.google.com
SIMULATOR_4_CALENDAR_ID=simulator4-calendar-id@group.calendar.google.com
```

### 2. Database Schema Update

Add columns to store calendar event IDs:

```sql
-- Add these columns to the bookings table
ALTER TABLE bookings 
  ADD COLUMN admin_calendar_event_id TEXT,
  ADD COLUMN simulator_calendar_event_id TEXT,
  ADD COLUMN coach_calendar_event_id TEXT;
```

### 3. Google Calendar Integration Module

Create a new file `lib/google-calendar.ts`:

```typescript
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { supabase } from './supabase';

// Service account credentials
const CREDENTIALS = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize auth client
const auth = new JWT({
  email: CREDENTIALS.client_email,
  key: CREDENTIALS.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

// Create calendar client
const calendar = google.calendar({ version: 'v3', auth });

// Calendar configurations
const ADMIN_CALENDAR_ID = process.env.ADMIN_CALENDAR_ID || 'primary';
const SIMULATOR_CALENDARS = {
  1: process.env.SIMULATOR_1_CALENDAR_ID,
  2: process.env.SIMULATOR_2_CALENDAR_ID,
  3: process.env.SIMULATOR_3_CALENDAR_ID,
  4: process.env.SIMULATOR_4_CALENDAR_ID,
};
const SIMULATOR_COLORS = {
  1: '1',  // Lavender
  2: '2',  // Sage
  3: '3',  // Grape
  4: '4',  // Flamingo
};

/**
 * Create booking events in all relevant calendars
 */
export async function createBookingEvents(booking: any) {
  try {
    const results = {
      adminEvent: null,
      simulatorEvent: null,
      coachEvent: null,
    };
    
    // 1. Create event in admin overview calendar
    const adminEvent = await createAdminCalendarEvent(booking);
    results.adminEvent = adminEvent;
    
    // 2. Create event in simulator-specific calendar
    const simEvent = await createSimulatorCalendarEvent(booking);
    results.simulatorEvent = simEvent;
    
    // 3. Create event in coach calendar if applicable
    if (booking.coach && booking.coach !== 'any') {
      const coachEvent = await createCoachCalendarEvent(booking);
      results.coachEvent = coachEvent;
    }
    
    // Store all event IDs in database for future reference
    await updateBookingWithCalendarIds(booking.id, {
      admin_event_id: adminEvent.eventId,
      simulator_event_id: simEvent.eventId,
      coach_event_id: results.coachEvent?.eventId || null,
    });
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error creating calendar events:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create event in admin overview calendar
 */
async function createAdminCalendarEvent(booking: any) {
  const simulatorId = booking.simulator_id;
  const startDate = new Date(booking.start_time);
  const endDate = new Date(booking.end_time);
  const userName = booking.users?.name || 'Customer';
  const userEmail = booking.users?.email;
  
  const event = {
    summary: `Sim #${simulatorId}: ${userName}`,
    location: '83 Gladstone Street, South Melbourne, VIC',
    description: `
Simulator Booking Details:
- Customer: ${userName} (${userEmail || 'No email'})
- Simulator: ${simulatorId}
- Booking ID: ${booking.id}
${booking.coach && booking.coach !== 'any' ? `- Coach: ${booking.coach}` : ''}
${booking.coaching_fee > 0 ? `- Coaching Fee: $${booking.coaching_fee.toFixed(2)}` : ''}
    `.trim(),
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Australia/Melbourne',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Australia/Melbourne',
    },
    colorId: SIMULATOR_COLORS[simulatorId],
    // Store booking ID in extended properties for future reference
    extendedProperties: {
      private: {
        bookingId: booking.id.toString(),
        simulatorId: simulatorId.toString(),
      },
    },
  };
  
  const response = await calendar.events.insert({
    calendarId: ADMIN_CALENDAR_ID,
    requestBody: event,
  });
  
  return {
    success: true,
    eventId: response.data.id,
    htmlLink: response.data.htmlLink,
  };
}

/**
 * Create event in simulator-specific calendar
 */
async function createSimulatorCalendarEvent(booking: any) {
  const simulatorId = booking.simulator_id;
  const calendarId = SIMULATOR_CALENDARS[simulatorId];
  
  if (!calendarId) {
    return {
      success: false,
      error: `No calendar configured for simulator ${simulatorId}`
    };
  }
  
  const startDate = new Date(booking.start_time);
  const endDate = new Date(booking.end_time);
  const userName = booking.users?.name || 'Customer';
  
  const event = {
    summary: `Booking: ${userName}`,
    description: `
Booking Details:
- Customer: ${userName} (${booking.users?.email || 'No email'})
- Booking ID: ${booking.id}
${booking.coach && booking.coach !== 'any' ? `- Coach: ${booking.coach}` : ''}
    `.trim(),
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Australia/Melbourne',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Australia/Melbourne',
    },
    extendedProperties: {
      private: {
        bookingId: booking.id.toString(),
      },
    },
  };
  
  const response = await calendar.events.insert({
    calendarId: calendarId,
    requestBody: event,
  });
  
  return {
    success: true,
    eventId: response.data.id,
    htmlLink: response.data.htmlLink,
  };
}

/**
 * Create event in coach's calendar or send invitation
 */
async function createCoachCalendarEvent(booking: any) {
  // Only proceed if there's a coach assigned
  if (!booking.coach || booking.coach === 'any') {
    return { success: false, reason: 'No coach assigned' };
  }
  
  try {
    const coachEmail = getCoachEmail(booking.coach);
    const startDate = new Date(booking.start_time);
    const endDate = new Date(booking.end_time);
    const userName = booking.users?.name || 'Customer';
    
    // For external coaches, we'll use calendar invites
    const isExternalCoach = !coachEmail.endsWith('simstudio.com.au');
    
    if (isExternalCoach) {
      // Create event in admin calendar but invite the coach
      const event = {
        summary: `Coach Session: ${booking.coach} with ${userName}`,
        location: '83 Gladstone Street, South Melbourne, VIC',
        description: `
Coaching Session:
- Customer: ${userName} (${booking.users?.email || 'No email'})
- Simulator: ${booking.simulator_id}
- Booking ID: ${booking.id}
${booking.coaching_fee > 0 ? `- Coaching Fee: $${booking.coaching_fee.toFixed(2)}` : ''}
        `.trim(),
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Australia/Melbourne',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Australia/Melbourne',
        },
        attendees: [
          { email: coachEmail }
        ],
        // Add reminders
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 60 },      // 1 hour before
          ],
        },
        extendedProperties: {
          private: {
            bookingId: booking.id.toString(),
            simulatorId: booking.simulator_id.toString(),
            coachName: booking.coach,
          },
        },
      };
      
      const response = await calendar.events.insert({
        calendarId: ADMIN_CALENDAR_ID,
        requestBody: event,
        sendUpdates: 'all', // Send invitations to attendees
      });
      
      return {
        success: true,
        eventId: response.data.id,
        calendarId: ADMIN_CALENDAR_ID,
        invitationSent: true,
      };
    } else {
      // For internal coaches, we'll use a shared calendar
      // This could be implemented similar to the admin calendar approach
      // For now, we'll just use the same invitation approach
      const event = {
        summary: `Coach Session: ${userName}`,
        location: '83 Gladstone Street, South Melbourne, VIC',
        description: `
Coaching Session:
- Customer: ${userName} (${booking.users?.email || 'No email'})
- Simulator: ${booking.simulator_id}
- Booking ID: ${booking.id}
${booking.coaching_fee > 0 ? `- Coaching Fee: $${booking.coaching_fee.toFixed(2)}` : ''}
        `.trim(),
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Australia/Melbourne',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Australia/Melbourne',
        },
        attendees: [
          { email: coachEmail }
        ],
        // Add reminders
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 60 },      // 1 hour before
          ],
        },
        extendedProperties: {
          private: {
            bookingId: booking.id.toString(),
            simulatorId: booking.simulator_id.toString(),
          },
        },
      };
      
      const response = await calendar.events.insert({
        calendarId: ADMIN_CALENDAR_ID,
        requestBody: event,
        sendUpdates: 'all', // Send invitations to attendees
      });
      
      return {
        success: true,
        eventId: response.data.id,
        calendarId: ADMIN_CALENDAR_ID,
        invitationSent: true,
      };
    }
  } catch (error) {
    console.error('Error creating coach calendar event:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update booking record with calendar event IDs
 */
async function updateBookingWithCalendarIds(bookingId: number, eventIds: any) {
  const { error } = await supabase
    .from('bookings')
    .update({
      admin_calendar_event_id: eventIds.admin_event_id,
      simulator_calendar_event_id: eventIds.simulator_event_id,
      coach_calendar_event_id: eventIds.coach_event_id,
    })
    .eq('id', bookingId);
  
  if (error) {
    console.error('Error updating booking with calendar IDs:', error);
    throw error;
  }
}

/**
 * Helper to get coach email from name
 */
function getCoachEmail(coachName: string): string {
  // This is a simplified example - in a real implementation, you would:
  // 1. Look up the coach in your database to get their email
  // 2. Or follow a naming convention if emails are standardized
  
  // For now, we'll use a simple mapping for demonstration
  const coachEmails = {
    'Chris': 'chris@simstudio.com.au',
    'Shane': 'shane@omniat.com.au',
    // Add more coaches as needed
  };
  
  // Try to find the coach in our mapping
  for (const [name, email] of Object.entries(coachEmails)) {
    if (coachName.includes(name)) {
      return email;
    }
  }
  
  // Fallback: generate an email based on the name
  const email = coachName
    .toLowerCase()
    .replace(/\s+/g, '.')
    .concat('@simstudio.com.au');
  
  return email;
}

/**
 * Update existing calendar events for a booking
 */
export async function updateBookingEvents(booking: any) {
  try {
    // First, delete existing events
    await deleteBookingEvents(booking);
    
    // Then create new events
    return await createBookingEvents(booking);
  } catch (error) {
    console.error('Error updating calendar events:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Delete booking events from all calendars
 */
export async function deleteBookingEvents(booking: any) {
  try {
    const promises = [];
    
    // Delete from admin calendar
    if (booking.admin_calendar_event_id) {
      promises.push(
        calendar.events.delete({
          calendarId: ADMIN_CALENDAR_ID,
          eventId: booking.admin_calendar_event_id,
          sendUpdates: 'all',
        }).catch(err => {
          console.error('Error deleting admin calendar event:', err);
          return null; // Continue with other deletions even if this one fails
        })
      );
    }
    
    // Delete from simulator calendar
    if (booking.simulator_calendar_event_id) {
      const simulatorId = booking.simulator_id;
      const calendarId = SIMULATOR_CALENDARS[simulatorId];
      
      if (calendarId) {
        promises.push(
          calendar.events.delete({
            calendarId: calendarId,
            eventId: booking.simulator_calendar_event_id,
          }).catch(err => {
            console.error('Error deleting simulator calendar event:', err);
            return null;
          })
        );
      }
    }
    
    // Delete from coach calendar (if it's a separate event)
    if (booking.coach_calendar_event_id) {
      promises.push(
        calendar.events.delete({
          calendarId: ADMIN_CALENDAR_ID, // Coach events are in admin calendar with invites
          eventId: booking.coach_calendar_event_id,
          sendUpdates: 'all',
        }).catch(err => {
          console.error('Error deleting coach calendar event:', err);
          return null;
        })
      );
    }
    
    // Execute all deletions in parallel
    await Promise.all(promises);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting calendar events:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate an iCal file for a booking
 * This can be used to provide "Add to Calendar" links in emails
 */
export function generateICalEvent(booking: any) {
  const startTime = new Date(booking.start_time).toISOString();
  const endTime = new Date(booking.end_time).toISOString();
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SimStudio//Booking//EN
BEGIN:VEVENT
UID:${booking.id}@simstudio.com
SUMMARY:SimStudio Booking #${booking.id}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startTime.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endTime.replace(/[-:]/g, '').split('.')[0]}Z
DESCRIPTION:Your simulator booking at SimStudio.
LOCATION:83 Gladstone Street, South Melbourne, VIC
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}
```

### 4. API Integration

Update the booking API endpoints to use the calendar integration:

#### Update `pages/api/bookings.ts`:

```typescript
// In the POST method (create booking)
// After successfully creating the booking in the database:

// Create calendar events
if (!isTemporaryBooking) {
  try {
    const { createBookingEvents } = require('../../lib/google-calendar');
    
    const calendarResult = await createBookingEvents(booking);
    
    if (!calendarResult.success) {
      // Log error but don't fail the booking creation
      console.error('Failed to create calendar events:', calendarResult.error);
    }
  } catch (calendarError) {
    console.error('Error with calendar integration:', calendarError);
  }
}

// In the PUT method (update booking)
// After successfully updating the booking in the database:

// Update calendar events
try {
  const { updateBookingEvents } = require('../../lib/google-calendar');
  
  const calendarResult = await updateBookingEvents(updatedBooking);
  
  if (!calendarResult.success) {
    // Log error but don't fail the booking update
    console.error('Failed to update calendar events:', calendarResult.error);
  }
} catch (calendarError) {
  console.error('Error with calendar integration:', calendarError);
}

// In the DELETE method (cancel booking)
// Before deleting the booking, get the full booking details
const { data: booking, error: getBookingError } = await supabase
  .from('bookings')
  .select('*')
  .eq('id', bookingId)
  .single();

// Delete calendar events
try {
  const { deleteBookingEvents } = require('../../lib/google-calendar');
  await deleteBookingEvents(booking);
} catch (calendarError) {
  console.error('Error deleting calendar events:', calendarError);
}
```

#### Update `pages/api/send-booking-confirmation.ts`:

```typescript
// After preparing the email content:

// Generate iCal attachment
const { generateICalEvent } = require('../../lib/google-calendar');
const icalContent = generateICalEvent(booking);

// Add "Add to Calendar" link in the email
const calendarLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icalContent)}`;
emailHtml += `
<p>
  <a href="${calendarLink}" download="SimStudio-Booking-${booking.id}.ics">
    Add to Calendar
  </a>
</p>
`;
```

## Testing and Deployment

### 1. Local Testing

1. Set up environment variables in `.env.local`
2. Test booking creation, updates, and cancellations
3. Verify events appear in the appropriate calendars
4. Test coach invitations

### 2. Production Deployment

1. Add environment variables to your hosting platform (e.g., Vercel)
2. Deploy the updated code
3. Run the database migration to add the new columns
4. Test the production deployment

## Maintenance Considerations

1. **Error Handling**: Calendar operations are wrapped in try/catch blocks to prevent booking failures if calendar integration fails
2. **Token Expiration**: Service account keys don't expire, but it's good practice to rotate them periodically
3. **Calendar Permissions**: If you add new calendars or change service accounts, remember to update sharing permissions
4. **Coach Management**: Keep the coach email mapping up to date as coaches join or leave

## Future Enhancements

1. **User Calendar Integration**: Allow users to add bookings to their personal calendars
2. **Calendar-Based Availability**: Use calendar free/busy API to check coach availability
3. **Two-Way Sync**: Listen for calendar changes and update bookings accordingly
4. **Admin Interface**: Create a UI for managing calendar settings and connections
