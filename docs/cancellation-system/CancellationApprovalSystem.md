# Cancellation Approval System Implementation Plan

This document outlines the technical implementation plan for the enhanced cancellation approval system that integrates with the coaching credit refund system.

## Overview

The new cancellation system will:
1. Allow users to request cancellations with a required reason
2. Submit all cancellations for admin approval
3. Provide admins with options for handling refunds
4. Integrate with the account credit system for coaching refunds

## Database Changes

> **IMPORTANT:** Instead of creating migration files, please use the Supabase MCP to make these database changes via the API. This ensures proper integration with the Supabase platform and maintains consistency across environments.

### 1. Update Bookings Table

```sql
ALTER TABLE bookings 
ADD COLUMN cancellation_reason TEXT,
ADD COLUMN cancellation_requested_at TIMESTAMP,
ADD COLUMN cancellation_status TEXT DEFAULT NULL,
ADD COLUMN is_late_cancellation BOOLEAN DEFAULT FALSE;
```

### 2. Update Credits Table

```sql
ALTER TABLE credits
ADD COLUMN coach_credit DECIMAL(10, 2) DEFAULT 0;

-- Leverage existing credit history tracking if available
-- If not already implemented, consider adding:
CREATE TABLE credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  simulator_hours_change DECIMAL(10, 2) DEFAULT 0,
  coach_credit_change DECIMAL(10, 2) DEFAULT 0,
  source_type TEXT, -- 'cancellation', 'admin_adjustment', 'purchase', etc.
  source_id INTEGER, -- booking_id, payment_id, etc.
  notes TEXT,
  admin_id INTEGER REFERENCES users(id) -- if admin-initiated
);
```

## API Endpoints

### 1. Modify Existing Endpoints

#### Update `/api/bookings` DELETE endpoint
- Change to handle cancellation requests instead of immediate cancellation
- Record cancellation reason and timestamp
- Set status to 'pending'
- Send notifications
- Return appropriate status to user

### 2. Create New Endpoints

#### Create `/api/cancellations` endpoint
- GET: Retrieve all cancellation requests (for admin)
- PUT: Update cancellation status (approve/reject)

#### Create `/api/cancellations/:id/approve` endpoint
- POST: Approve a cancellation request
- Handle credit refunds based on admin selection
- Send confirmation email

#### Create `/api/cancellations/:id/reject` endpoint
- POST: Reject a cancellation request
- Send notification to user

## Frontend Changes

### 1. User Interface

#### Update My Account Page
- Modify cancellation flow to include reason input
- Add status indicators for pending cancellations
- Display CoachCredit from coaching cancellations

#### Create Cancellation Request Modal
- Form for entering cancellation reason
- Clear messaging about the approval process
- Warning for late cancellations
- Use terminology "credits" instead of "refunds"

### 2. Admin Interface

#### Create Cancellation Requests Tab
- List of all pending cancellation requests
- Filters for status, date, etc.
- Detailed view of each request

#### Create Cancellation Review Interface
- Display booking details, user info, and cancellation reason
- Show timing information (how close to booking time)
- Provide credit return options:
  * Full credit (Simulator Hours + CoachCredit)
  * Partial credit (Simulator Hours only)
  * No credit
- Approval/rejection buttons with optional comment

## Email Notifications

### 1. User Notifications

#### Cancellation Request Confirmation
- Acknowledge receipt of cancellation request
- Explain approval process and timeline
- Include booking details

#### Cancellation Approval Notification
- Confirm cancellation has been approved
- Detail any returned credits (simulator hours and/or account credit)
- Include updated account credit balance

#### Cancellation Rejection Notification
- Inform user that cancellation was rejected
- Include admin's reason (if provided)
- Remind of booking details

### 2. Admin Notifications

#### New Cancellation Request Alert
- Notify of new cancellation request
- Include booking and user details
- Show cancellation reason
- Provide direct link to admin review page

## Implementation Phases

### Phase 1: Database & Backend Changes
- Update database schema
- Modify the bookings API
- Implement the account credit system

### Phase 2: Admin Interface
- Create the cancellation approval interface
- Add refund processing options
- Implement the refund logic

### Phase 3: User Interface
- Update the cancellation flow
- Add messaging about the approval process
- Display Simulator Hours and CoachCredit
- Modify checkout process to automatically apply CoachCredit

### Phase 3.5: Admin Interface Enhancement
- Extend existing Simulator Hours management to include CoachCredit
- Reuse existing admin forms and validation logic
- Ensure proper tracking of both credit types

### Phase 4: Email Notifications
- Create notification templates
- Set up notification triggers

## Testing Plan

1. **Unit Tests**
   - Test cancellation request creation
   - Test approval/rejection logic
   - Test credit return calculations
   - Test automatic credit application during checkout

2. **Integration Tests**
   - Test end-to-end cancellation flow
   - Test email notifications
   - Test admin approval process
   - Test checkout with account credit

3. **User Acceptance Testing**
   - Test with real users
   - Verify UI clarity and usability
   - Confirm email notifications are clear

## Rollout Strategy

1. Deploy database changes
2. Deploy backend API changes
3. Deploy admin interface
4. Deploy user interface changes
5. Enable the system for a subset of users
6. Monitor and gather feedback
7. Roll out to all users

## Future Enhancements

1. **Automated Approvals**
   - Automatically approve cancellations that meet certain criteria
   - Reduce admin workload for standard cases

2. **Cancellation Analytics**
   - Track cancellation reasons and patterns
   - Identify opportunities for business improvement

3. **Partial Cancellations**
   - Allow users to cancel just the coaching portion of a booking
   - Keep the simulator booking intact
