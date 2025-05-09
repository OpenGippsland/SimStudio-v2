# Cancellation System UI Mockups

This document provides mockups and descriptions for the user interfaces needed for the cancellation approval system.

## User Interfaces

### 1. Cancellation Request Modal

When a user clicks "Cancel Booking" on their account page, they will see this modal:

```
┌─────────────────────────────────────────────────────┐
│                 Cancel Booking                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  You are cancelling:                                │
│  Simulator 2 - Monday, May 12, 2025 at 2:00 PM      │
│  2 hour session                                     │
│                                                     │
│  ⚠️ Please note:                                    │
│  • All cancellations require admin approval         │
│  • This booking is within 24 hours of the           │
│    scheduled time. Late cancellations may not       │
│    receive full credits.                            │
│                                                     │
│  Please provide a reason for cancellation:          │
│  ┌─────────────────────────────────────────────┐    │
│  │                                             │    │
│  │                                             │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [ Cancel ]                [ Request Cancellation ]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Cancellation Request Confirmation

After submitting a cancellation request:

```
┌─────────────────────────────────────────────────────┐
│           Cancellation Request Submitted            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✓ Your cancellation request has been submitted     │
│    and is pending admin review.                     │
│                                                     │
│  • You will receive an email notification when      │
│    your request has been processed.                 │
│  • The booking will remain active until approved.   │
│                                                     │
│  [ Close ]                                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 3. My Account Page - Pending Cancellations

Updated booking card in the user's account page:

```
┌───────────────────────────────────────────────┐
│ Simulator 2                     2 hours       │
├───────────────────────────────────────────────┤
│                                               │
│ Monday, May 12, 2025 at 2:00 PM               │
│ Booking #1234                                 │
│                                               │
│ Coach: John Smith                             │
│                                               │
│ ⏳ Cancellation pending approval              │
│    Requested on: May 10, 2025                 │
│                                               │
└───────────────────────────────────────────────┘
```

## Admin Interfaces

### 1. Cancellation Requests Tab

New tab in the admin panel:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Dashboard | Bookings | Users | Coaches | Packages | Cancellation Requests (3) | Settings │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  Cancellation Requests                                                     [ Refresh ]  │
│                                                                                         │
│  Filter: [ All ▼ ]  [ Date Range ▼ ]  [ Search... ]                                     │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐    │
│  │ ID   User         Booking Date     Requested     Status   Time Until   Actions  │    │
│  ├─────────────────────────────────────────────────────────────────────────────────┤    │
│  │ #32  Jane Doe     May 12, 2:00 PM  May 10        Pending  1 day, 3h    [Review] │    │
│  │ #31  John Smith   May 15, 10:00 AM May 9         Pending  4 days, 11h  [Review] │    │
│  │ #30  Alice Brown  May 11, 3:30 PM  May 8         Pending  5 hours      [Review] │    │
│  └─────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Cancellation Review Interface

When an admin clicks "Review" on a cancellation request:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           Review Cancellation Request #32                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  Booking Details                                                                        │
│  ───────────────                                                                        │
│  User:           Jane Doe (jane@example.com)                                            │
│  Booking ID:     #1234                                                                  │
│  Date & Time:    Monday, May 12, 2025 at 2:00 PM - 4:00 PM                              │
│  Simulator:      Simulator 2                                                            │
│  Coach:          John Smith                                                             │
│  Hours:          2 simulator hours                                                      │
│  Coaching:       1 hour ($120.00)                                                       │
│                                                                                         │
│  Cancellation Details                                                                   │
│  ────────────────────                                                                   │
│  Requested:      May 10, 2025 at 10:45 AM                                               │
│  Time until booking: ⚠️ 1 day, 3 hours (Late cancellation)                              │
│                                                                                         │
│  Reason provided:                                                                       │
│  ────────────────                                                                       │
│  "I have come down with the flu and won't be able to make it to my session.             │
│  I have a doctor's note if needed. Sorry for the inconvenience."                        │
│                                                                                         │
│  Decision                                                                               │
│  ────────                                                                               │
│  Credit return options:                                                                 │
│  ○ Full credit (2 Simulator Hours + $120.00 CoachCredit)                                │
│  ○ Partial credit (Simulator Hours only)                                                │
│  ○ No credit                                                                            │
│                                                                                         │
│  Admin comment (optional):                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐            │
│  │                                                                         │            │
│  └─────────────────────────────────────────────────────────────────────────┘            │
│                                                                                         │
│  [ Reject Cancellation ]                                    [ Approve Cancellation ]    │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Cancellation Approval Confirmation

After an admin approves a cancellation:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           Cancellation Request Approved                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ✓ Cancellation request #32 has been approved.                                          │
│                                                                                         │
│  Credits returned:                                                                      │
│  • 2 Simulator Hours added to user's account                                            │
│  • $120.00 added to user's CoachCredit                                                  │
│                                                                                         │
│  An email notification has been sent to Jane Doe.                                       │
│                                                                                         │
│  [ Back to Cancellation Requests ]                                                      │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Email Templates

### 1. Cancellation Request Confirmation Email

```
Subject: SimStudio - Cancellation Request Received (#1234)

Dear [User Name],

We have received your request to cancel the following booking:

Booking Details:
- Booking ID: #1234
- Date: Monday, May 12, 2025
- Time: 2:00 PM - 4:00 PM
- Simulator: Simulator 2
- Coach: John Smith

Your cancellation request is now pending review by our administrators. You will receive another email once your request has been processed.

Please note that your booking remains active until the cancellation is approved.

If you have any questions, please contact us at support@simstudio.com.

Thank you,
The SimStudio Team
```

### 2. Admin Notification Email

```
Subject: SimStudio - New Cancellation Request (#1234)

A new cancellation request has been submitted:

Booking Details:
- Booking ID: #1234
- User: Jane Doe (jane@example.com)
- Date: Monday, May 12, 2025
- Time: 2:00 PM - 4:00 PM
- Simulator: Simulator 2
- Coach: John Smith

Cancellation Details:
- Requested: May 10, 2025 at 10:45 AM
- Time until booking: 1 day, 3 hours (Late cancellation)

Reason provided:
"I have come down with the flu and won't be able to make it to my session. 
I have a doctor's note if needed. Sorry for the inconvenience."

Please review this request in the admin panel:
[Review Cancellation Request]

SimStudio Admin System
```

### 3. Cancellation Approval Email

```
Subject: SimStudio - Booking Cancellation Approved (#1234)

Dear [User Name],

Your request to cancel the following booking has been approved:

Booking Details:
- Booking ID: #1234
- Date: Monday, May 12, 2025
- Time: 2:00 PM - 4:00 PM
- Simulator: Simulator 2
- Coach: John Smith

The following credits have been returned to your account:
- 2 Simulator Hours
- $120.00 CoachCredit

Your updated account balances:
- Simulator Hours: 5 hours
- CoachCredit: $120.00

You can use your account credit for future bookings at SimStudio.

Thank you,
The SimStudio Team
```

### 4. Cancellation Rejection Email

```
Subject: SimStudio - Booking Cancellation Not Approved (#1234)

Dear [User Name],

Your request to cancel the following booking could not be approved:

Booking Details:
- Booking ID: #1234
- Date: Monday, May 12, 2025
- Time: 2:00 PM - 4:00 PM
- Simulator: Simulator 2
- Coach: John Smith

Admin comment:
"As per our cancellation policy, cancellations within 24 hours of the booking time are not eligible for credits. Your booking will remain active."

Your booking remains scheduled for the original date and time. If you are unable to attend, please contact us directly at support@simstudio.com.

Thank you,
The SimStudio Team
