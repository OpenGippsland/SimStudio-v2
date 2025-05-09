# Cancellation System Implementation Prompt

## Overview

This document serves as a prompt for implementing the enhanced cancellation approval system with CoachCredit refunds for SimStudio. The complete documentation for this system is available in the `docs/cancellation-system` directory.

## Task Description

Implement a comprehensive cancellation approval system that:

1. Allows users to request cancellations with a required reason
2. Submits all cancellations for admin approval
3. Handles late cancellations (within 24 hours) appropriately
4. Integrates with the credit system to:
   - Return Simulator Hours to the user's account
   - Convert coaching fees to CoachCredit when approved

## Key Components to Implement

1. **Database Changes**
   - Add cancellation-related fields to the bookings table
   - Add CoachCredit field to the credits table
   - Create credit_transactions table for tracking history

2. **API Endpoints**
   - Modify existing booking cancellation endpoint
   - Create new endpoints for cancellation approval/rejection

3. **User Interface**
   - Cancellation request modal with reason input
   - Status indicators for pending cancellations
   - Updated account page showing both credit types

4. **Admin Interface**
   - Cancellation requests dashboard
   - Approval interface with credit return options
   - Credit management integration

5. **Email Notifications**
   - Cancellation request confirmation
   - Approval/rejection notifications
   - Admin alerts for new requests

## Implementation Notes

1. **Database Changes**
   - Use Supabase MCP to make all database changes via the API instead of creating migration files
   - Follow the SQL provided in the documentation

2. **Terminology**
   - Use "Simulator Hours" for time-based credits
   - Use "CoachCredit" for monetary credits from coaching cancellations
   - Be consistent with this terminology throughout the implementation

3. **Testing**
   - Test the complete cancellation flow
   - Verify credit calculations and updates
   - Test email notifications

## Reference Documentation

All detailed documentation is available in the `docs/cancellation-system` directory:

1. `CancellationSystemSummary.md` - Overview of the entire system
2. `CancellationApprovalSystem.md` - Technical implementation details
3. `CancellationWorkflow.md` - Process flow diagram and steps
4. `CancellationUIMockups.md` - UI designs and email templates
5. `CoachingCreditRefund.md` - Credit refund approach and options
6. `CreditTerminology.md` - Standardized terminology definitions

## Implementation Approach

1. Start with database changes using Supabase MCP
2. Implement backend API endpoints
3. Create admin interface components
4. Develop user-facing cancellation flow
5. Set up email notifications
6. Test the complete system

## Success Criteria

The implementation will be considered successful when:

1. Users can request cancellations with reasons
2. Admins can review and approve/reject cancellations
3. Credits (both Simulator Hours and CoachCredit) are properly managed
4. All notifications are sent correctly
5. The system handles late cancellations appropriately
