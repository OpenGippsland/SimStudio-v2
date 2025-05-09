# Credit System Terminology

This document defines the standardized terminology for the SimStudio credit system to ensure consistency across the codebase, UI, and documentation.

## Terminology Definitions

### Simulator Hours

**Definition:** Time-based credits that users can apply toward simulator sessions.

**Usage:**
- Database field: `simulator_hours` in the `credits` table
- UI display: "Simulator Hours"
- API references: `simulator_hours`

**Examples:**
- "You have 5 Simulator Hours remaining"
- "This session requires 2 Simulator Hours"
- "2 Simulator Hours have been added to your account"

### CoachCredit

**Definition:** Monetary value credits that users can apply toward any booking (simulator or coaching).

**Usage:**
- Database field: `coach_credit` in the `credits` table
- UI display: "CoachCredit"
- API references: `coach_credit`

**Examples:**
- "Your CoachCredit balance: $120.00"
- "$50.00 CoachCredit will be applied to this booking"
- "Cancellation approved with $120.00 CoachCredit"

## Implementation Guidelines

### Database

> **IMPORTANT:** Instead of creating migration files, please use the Supabase MCP to make these database changes via the API. This ensures proper integration with the Supabase platform and maintains consistency across environments.

```sql
-- Credits table structure
CREATE TABLE credits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  simulator_hours DECIMAL(10, 2) DEFAULT 0,
  coach_credit DECIMAL(10, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit transactions table for history
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

### API

When returning credit information in API responses:

```json
{
  "user_id": 123,
  "credits": {
    "simulator_hours": 5.0,
    "coach_credit": 120.00
  }
}
```

### UI Components

When displaying credit information in the UI:

```jsx
<div className="user-credits">
  <div className="credit-item">
    <span className="credit-label">Simulator Hours:</span>
    <span className="credit-value">{user.simulator_hours}</span>
  </div>
  <div className="credit-item">
    <span className="credit-label">CoachCredit:</span>
    <span className="credit-value">${user.coach_credit.toFixed(2)}</span>
  </div>
</div>
```

## Checkout Process

During checkout:

1. Check for available CoachCredit
2. Automatically apply CoachCredit to the total amount
3. Only charge the remaining balance after CoachCredit is applied
4. Display the applied CoachCredit amount clearly in the checkout summary

## Admin Interface

In the admin interface:

1. Display both Simulator Hours and CoachCredit in user profiles
2. Allow admins to adjust both credit types
3. Maintain a history of all credit adjustments with reasons
4. Show credit balances in the cancellation approval interface

## Migration Notes

When migrating from the previous terminology:

1. Rename `account_credit` to `coach_credit` in the database
2. Update all UI references from "account credit" to "CoachCredit"
3. Update API documentation to reflect the new terminology
4. Update email templates to use the new terminology consistently
