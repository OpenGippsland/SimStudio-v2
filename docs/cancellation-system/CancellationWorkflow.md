# Cancellation Approval Workflow

The following diagram illustrates the complete workflow for the cancellation approval system:

```mermaid
flowchart TD
    %% User actions
    A[User] -->|Requests cancellation| B[Enter cancellation reason]
    B --> C{System checks timing}
    C -->|Within 24 hours| D[Flag as late cancellation]
    C -->|More than 24 hours| E[Standard cancellation]
    D --> F[Set status to 'pending']
    E --> F
    
    %% Notifications
    F --> G[Email sent to user\nconfirming request]
    F --> H[Email sent to admin/coach\nabout new request]
    
    %% Admin review
    H --> I[Admin reviews request]
    I --> J{Admin decision}
    
    %% Approval paths
    J -->|Approve with\nfull credit| K[Return Simulator Hours\n+ add CoachCredit]
    J -->|Approve with\npartial credit| L[Return Simulator\nHours only]
    J -->|Approve with\nno credit| M[No credits returned]
    
    %% Rejection path
    J -->|Reject| N[Cancellation rejected\nBooking remains active]
    
    %% Final notifications
    K --> O[Email user about\napproved cancellation\nwith full refund]
    L --> P[Email user about\napproved cancellation\nwith partial refund]
    M --> Q[Email user about\napproved cancellation\nwith no refund]
    N --> R[Email user about\nrejected cancellation]
    
    %% Credit updates
    K --> S[Update Simulator Hours\nand CoachCredit]
    L --> T[Update Simulator\nHours only]
    
    %% Styling
    classDef userAction fill:#d4f1f9,stroke:#05a5d1,stroke-width:2px
    classDef systemProcess fill:#e1f5fe,stroke:#0288d1,stroke-width:1px
    classDef adminAction fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
    classDef decision fill:#ffebee,stroke:#f44336,stroke-width:1px
    classDef notification fill:#e8f5e9,stroke:#4caf50,stroke-width:1px
    
    class A,B userAction
    class C,D,E,F,S,T systemProcess
    class I,K,L,M,N adminAction
    class J decision
    class G,H,O,P,Q,R notification
```

## Key Process Steps

1. **User Initiates Cancellation**
   - User requests to cancel a booking
   - System requires a cancellation reason

2. **System Processing**
   - System checks if cancellation is within 24 hours of booking
   - Flags late cancellations but still processes the request
   - Sets cancellation status to 'pending'
   - Sends notifications to user and admin/coach

3. **Admin Review**
   - Admin reviews the cancellation request
   - Can see booking details, user information, and cancellation reason
   - For late cancellations, timing is clearly highlighted

4. **Admin Decision**
   - Admin has multiple options:
     * Approve with full credit (Simulator Hours + CoachCredit)
     * Approve with partial credit (Simulator Hours only)
     * Approve with no credit
     * Reject the cancellation request

5. **Credit Processing**
   - If approved with full credit:
     * Simulator Hours are returned to user's credit balance
     * Coaching fee is converted to CoachCredit
   - If approved with partial credit:
     * Only Simulator Hours are returned
     * No CoachCredit is issued
   - If approved with no credit:
     * No credits are returned to the user

6. **Final Notifications**
   - User receives email about the decision
   - Email includes details about any refunded credits
   - For rejections, includes admin's reason (if provided)
