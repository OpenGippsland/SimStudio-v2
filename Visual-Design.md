# Visual Design - Simplified Coach Availability Flow

## New Approach
- Progressive disclosure with sensible defaults
- Pill-style selectors instead of dropdowns
- Front-loaded decisions before showing available sessions
- Coach always starts at the beginning of a session

## Step 1: Initial Form with Defaults

```
┌─────────────────────────────────────────┐
│ New Booking                             │
│                                         │
│ Simulator Duration:                     │
│ [1h] [2h] [3h] [4h]                     │
│                                         │
│ Do you want a coach?                    │
│ [Yes] [No]                              │
│                                         │
│ [Find Available Sessions]               │
└─────────────────────────────────────────┘
```

*Note: "1h" and "No" are pre-selected by default*

## Step 1a: If User Selects "Yes" for Coach

```
┌─────────────────────────────────────────┐
│ New Booking                             │
│                                         │
│ Simulator Duration:                     │
│ [1h] [2h] [3h] [4h]                     │
│                                         │
│ Do you want a coach?                    │
│ [Yes] [No]                              │
│                                         │
│ Select Coach:                           │
│ [CB] [AD] [Sarkit] [Any]                │
│                                         │
│ Coach Duration:                         │
│ [1h] [2h]                               │
│                                         │
│ [Find Available Sessions]               │
└─────────────────────────────────────────┘
```

*Note: Coach options only appear after "Yes" is selected*

## Step 2: Available Sessions Cards (No Coach)

```
┌─────────────────────────┐
│ Monday, May 2           │
│                         │
│ Available Sessions:     │
│ [9:00 AM - 10:00 AM]    │
│ [10:00 AM - 11:00 AM]   │
│ [11:00 AM - 12:00 PM]   │
│ [1:00 PM - 2:00 PM]     │
│ [2:00 PM - 3:00 PM]     │
└─────────────────────────┘

┌─────────────────────────┐
│ Tuesday, May 3          │
│                         │
│ Available Sessions:     │
│ [9:00 AM - 10:00 AM]    │
│ [10:00 AM - 11:00 AM]   │
│ [1:00 PM - 2:00 PM]     │
└─────────────────────────┘
```

*Note: Session times reflect the selected duration (1 hour by default)*

## Step 2: Available Sessions Cards (With Coach)

```
┌─────────────────────────┐
│ Monday, May 2           │
│                         │
│ Available Sessions:     │
│ [9:00 AM - 11:00 AM]    │
│ [1:00 PM - 3:00 PM]     │
└─────────────────────────┘

┌─────────────────────────┐
│ Tuesday, May 3          │
│                         │
│ Available Sessions:     │
│ [9:00 AM - 11:00 AM]    │
└─────────────────────────┘

┌─────────────────────────┐
│ Wednesday, May 4        │
│                         │
│ No available sessions   │
└─────────────────────────┘
```

*Note: Fewer sessions available due to coach availability constraints*

## Step 3: Confirmation (No Coach)

```
┌─────────────────────────────────────────┐
│ Booking Confirmation                    │
│                                         │
│ Date: Monday, May 2                     │
│ Time: 9:00 AM - 10:00 AM                │
│                                         │
│ Simulator: 1 hour                       │
│ Coach: None                             │
│                                         │
│ [Confirm Booking]                       │
└─────────────────────────────────────────┘
```

## Step 3: Confirmation (With Coach)

```
┌─────────────────────────────────────────┐
│ Booking Confirmation                    │
│                                         │
│ Date: Monday, May 2                     │
│ Time: 9:00 AM - 11:00 AM                │
│                                         │
│ Simulator: 2 hours                      │
│ Coach CB: 2 hours (9:00 AM - 11:00 AM)  │
│                                         │
│ [Confirm Booking]                       │
└─────────────────────────────────────────┘
```

## Step 3: Confirmation (Coach for Portion of Session)

```
┌─────────────────────────────────────────┐
│ Booking Confirmation                    │
│                                         │
│ Date: Monday, May 2                     │
│ Time: 9:00 AM - 12:00 PM                │
│                                         │
│ Simulator: 3 hours                      │
│ Coach CB: 1 hour (9:00 AM - 10:00 AM)   │
│                                         │
│ [Confirm Booking]                       │
└─────────────────────────────────────────┘
```

*Note: Coach always starts at the beginning of the session*

## Key Benefits

1. **Simplified workflow**: Front-loaded decisions with progressive disclosure
2. **Touch-friendly**: Pill-style selectors instead of dropdowns
3. **Clear rule implementation**: Coach always starts at the beginning of the session
4. **Reduced interaction**: Users just select a time slot from available options
5. **Sensible defaults**: 1-hour session with no coach as the default selection
6. **Visual clarity**: Available sessions clearly displayed as pills
