# Sim Studio Booking System Implementation Summary

## System Architecture
- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite
- **API**: REST endpoints

## Key Components

### Database Schema
```mermaid
erDiagram
    users {
        id INTEGER PK
        shopify_id TEXT UNIQUE
        email TEXT UNIQUE
        created_at DATETIME
    }
    
    bookings {
        id INTEGER PK
        user_id INTEGER FK
        simulator_id INTEGER
        start_time DATETIME
        end_time DATETIME
        coach TEXT
        status TEXT
        updated_at DATETIME
        cancellation_reason TEXT
        booking_type TEXT
    }
    
    coach_availability {
        id INTEGER PK
        coach_id TEXT
        day_of_week INTEGER
        start_hour INTEGER
        end_hour INTEGER
    }
    
    business_hours {
        id INTEGER PK
        day_of_week INTEGER
        open_hour INTEGER
        close_hour INTEGER
        is_closed BOOLEAN
    }
    
    special_dates {
        id INTEGER PK
        date DATE UNIQUE
        is_closed BOOLEAN
        open_hour INTEGER
        close_hour INTEGER
        description TEXT
    }
    
    credits {
        user_id INTEGER PK
        simulator_hours INTEGER
        coaching_sessions INTEGER
    }
    
    packages {
        id INTEGER PK
        name TEXT
        hours INTEGER
        price DECIMAL
        description TEXT
        is_active BOOLEAN
    }
```

### API Endpoints

#### Users
- `POST /api/users`
  - Creates new user
  - Parameters: { email: string }
  - Returns: { id: number }

#### Bookings
- `POST /api/bookings` 
  - Creates new booking
  - Parameters: { userId, simulatorId, startTime, endTime, coach }
  - Returns: { id: number }
  - Validation:
    - Business hours (8am-6pm by default)
    - Special dates and holidays
    - Booking window (2 hours to 30 days in advance)
    - Coach availability
    - Simulator availability

- `GET /api/bookings`
  - Lists all bookings
  - Returns: Booking[]

#### Coach Availability
- `POST /api/coach-availability`
  - Sets coach availability
  - Parameters: { coachId, dayOfWeek, startHour, endHour }
  - Returns: { id: number }

- `GET /api/coach-availability`
  - Lists coach availability
  - Optional query: coachId
  - Returns: CoachAvailability[]

#### Business Hours
- `POST /api/business-hours`
  - Sets business hours for a day of the week
  - Parameters: { dayOfWeek, openHour, closeHour, isClosed }
  - Returns: { id: number }

- `GET /api/business-hours`
  - Lists business hours
  - Optional query: dayOfWeek
  - Returns: BusinessHours[]

#### Special Dates
- `POST /api/special-dates`
  - Adds or updates a special date (holiday, custom hours)
  - Parameters: { date, isClosed, openHour?, closeHour?, description? }
  - Returns: { id: number }

- `GET /api/special-dates`
  - Lists special dates
  - Optional queries: date, from, to
  - Returns: SpecialDate[]

- `DELETE /api/special-dates`
  - Deletes a special date
  - Required query: date
  - Returns: { success: true }

#### Packages
- `GET /api/packages`
  - Lists all active packages
  - Optional query: id (for specific package)
  - Returns: Package[] or Package

- `POST /api/packages`
  - Creates a new package
  - Parameters: { name, hours, price, description }
  - Returns: { id: number }

- `PUT /api/packages`
  - Updates an existing package
  - Required query: id
  - Parameters: { name?, hours?, price?, description?, is_active? }
  - Returns: { message: string }

- `DELETE /api/packages`
  - Deactivates a package (soft delete)
  - Required query: id
  - Returns: { message: string }

#### User Credits
- `GET /api/user-credits`
  - Gets a user's credits
  - Required query: userId
  - Returns: { user_id, simulator_hours, coaching_sessions }

- `POST /api/user-credits`
  - Adds credits to a user (when purchasing a package)
  - Parameters: { userId, packageId }
  - Returns: { message: string, credits: { user_id, simulator_hours, coaching_sessions } }

- `PUT /api/user-credits`
  - Updates a user's credits directly (admin function)
  - Required query: userId
  - Parameters: { simulator_hours?, coaching_sessions? }
  - Returns: { message: string, credits: { user_id, simulator_hours, coaching_sessions } }

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Access at:
http://localhost:3001

## Test Data Example

1. Create user:
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d '{"email":"test@simstudio.com"}'
```

2. Create booking:
```bash
curl -X POST http://localhost:3001/api/bookings -H "Content-Type: application/json" -d '{"userId":1,"simulatorId":2,"startTime":"2025-04-18T10:00:00","endTime":"2025-04-18T11:00:00","coach":"CB"}'
```

3. Set business hours:
```bash
curl -X POST http://localhost:3001/api/business-hours -H "Content-Type: application/json" -d '{"dayOfWeek":1,"openHour":8,"closeHour":18,"isClosed":false}'
```

4. Set coach availability:
```bash
curl -X POST http://localhost:3001/api/coach-availability -H "Content-Type: application/json" -d '{"coachId":"CB","dayOfWeek":1,"startHour":9,"endHour":17}'
```

5. Set special date:
```bash
curl -X POST http://localhost:3001/api/special-dates -H "Content-Type: application/json" -d '{"date":"2025-12-25","isClosed":true,"description":"Christmas Day"}'
```

6. Create package:
```bash
curl -X POST http://localhost:3001/api/packages -H "Content-Type: application/json" -d '{"name":"Single Hour","hours":1,"price":99.99,"description":"One hour of simulator time"}'
```

7. Add credits to user:
```bash
curl -X POST http://localhost:3001/api/user-credits -H "Content-Type: application/json" -d '{"userId":1,"packageId":1}'
```

8. Update user credits (admin):
```bash
curl -X PUT http://localhost:3001/api/user-credits?userId=1 -H "Content-Type: application/json" -d '{"simulator_hours":10}'
```

## Next Steps
- User authentication
- Booking modification and cancellation
- Calendar view for visual booking management
- Shopify integration
- Recurring bookings feature
- Enhanced date picker with visual indication of closed dates

## Implemented Features
- Basic booking system with simulator and coach selection
- Business hours validation with admin interface
- Special dates/holidays handling
- Coach availability management
- Booking window validation (2 hours to 30 days in advance)
- Admin dashboard for system configuration
- Credit system implementation:
  - User credit tracking for simulator hours
  - Package management for purchasing credits
  - Credit validation and deduction during booking
  - Admin interface for managing packages and user credits
