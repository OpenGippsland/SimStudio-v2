# Booking System Rules

This document outlines the validation rules and business logic implemented in the SimStudio booking system.

## Database Schema

The booking system uses the following tables:

### Users
- `id`: Primary key
- `shopify_id`: Unique Shopify customer ID (optional)
- `email`: Unique email address
- `created_at`: Timestamp of user creation

### Bookings
- `id`: Primary key
- `user_id`: Foreign key to users table
- `simulator_id`: ID of the simulator (1-4)
- `start_time`: Start date and time of booking
- `end_time`: End date and time of booking
- `coach`: Coach ID or 'none'/'any'
- `status`: Booking status (default: 'confirmed')
- `updated_at`: Last update timestamp
- `cancellation_reason`: Reason for cancellation (if applicable)
- `booking_type`: Type of booking (default: 'single')

### Coach Availability
- `id`: Primary key
- `coach_id`: Coach identifier
- `day_of_week`: Day of week (0-6, Sunday-Saturday)
- `start_hour`: Start hour (0-23)
- `end_hour`: End hour (0-23)

### Business Hours
- `id`: Primary key
- `day_of_week`: Day of week (0-6, Sunday-Saturday)
- `open_hour`: Opening hour (default: 8)
- `close_hour`: Closing hour (default: 18)
- `is_closed`: Whether the business is closed on this day

### Special Dates
- `id`: Primary key
- `date`: Date (YYYY-MM-DD)
- `is_closed`: Whether the business is closed on this date
- `open_hour`: Custom opening hour (if different from regular hours)
- `close_hour`: Custom closing hour (if different from regular hours)
- `description`: Description of the special date

### Credits
- `user_id`: Foreign key to users table
- `simulator_hours`: Number of simulator hours available
- `coaching_sessions`: Number of coaching sessions available

## Validation Rules

### 1. Business Hours Validation
- Bookings must be made within business hours (default: 8am-6pm)
- The system checks the `business_hours` table for the day of the week
- If no entry exists for that day, default hours (8am-6pm) are used
- If `is_closed` is true for that day, bookings are not allowed
- Both start time and end time must be within business hours

### 2. Special Dates Validation
- The system checks the `special_dates` table for the booking date
- If the date is marked as closed, bookings are not allowed
- If custom hours are specified, bookings must be within those hours
- Special date rules override regular business hours

### 3. Booking Window Validation
- Bookings must be made at least 2 hours in advance
- Bookings cannot be made more than 30 days in advance

### 4. Simulator Availability Validation
- The system has 4 simulators (numbered 1-4)
- A simulator cannot be double-booked for overlapping time periods
- The system automatically finds the first available simulator
- If all simulators are booked for a time slot, the booking is rejected

### 5. Coach Availability Validation
- Coaches have defined availability blocks in the `coach_availability` table
- When a specific coach is requested, the system checks:
  - If the coach has availability for the entire duration of the booking (not just the start time)
  - If the coach is already booked during any part of the requested time slot
- The system prevents any overlapping bookings for coaches
- Coach options:
  - 'none': No coach required
  - 'any': Any available coach
  - Specific coach ID (e.g., 'CB', 'AD', 'Sarkit')

### 6. Date and Time Validation
- Valid date formats are required
- End time must be after start time
- Bookings are made in hourly increments
- The service only operates in Melbourne. All times in code, db and server should refelct this to avoid conflics 

## Recent Improvements

### 1. Database Migration to Supabase
- Migrated from SQLite to Supabase for better serverless compatibility
- Updated all API endpoints to use Supabase client
- Fixed type handling for query parameters in API endpoints

### 2. Enhanced Coach Booking Validation
- Improved validation to check coach availability for the entire booking duration
- Fixed overlapping booking detection to prevent double-booking coaches
- Enhanced error messages to provide more specific information about booking conflicts

### 3. Booking Management UI
- Added a dedicated bookings page with improved visualization
- Implemented booking cancellation functionality with automatic credit refunds
- Added grouping of bookings by date for better organization

## Future Enhancements

### 1. Credit System
- Validate if users have sufficient credits before allowing bookings
- Track credit usage and expiration

### 2. Cancellation Policy
- Implement rules for cancellations (e.g., 24-hour notice)
- Handle refunds or credit returns

### 3. Package Bookings
- Support for 10-session packages
- Discount logic for package bookings

### 4. Recurring Bookings
- Allow users to set up weekly or regular sessions

### 5. Trade/Group Customer Rules
- Special permissions for booking multiple simulators
- Facility booking options
