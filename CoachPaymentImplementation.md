# SimStudio Coach Payment Implementation Plan

## Overview
Implement a pay-as-you-go model for coaching services where each coach has an individual hourly rate set in the admin section, separate from the simulator credit system.

## Current Status

The initial implementation of coach profiles and the admin interface has been completed:
- Coach profiles table has been created
- Admin interface for managing coach profiles is working
- API endpoints for coach profiles have been implemented

However, the booking system is not yet integrated with the coach profiles system. The booking flow still uses the older coach availability system and doesn't incorporate the hourly rates from coach profiles.

## Integration Plan: Connecting Coach Profiles to Booking System

### 1. Update Booking Types and Interfaces

Update `lib/booking/types.ts` to include coach profile information:

```typescript
// Add to existing types
interface CoachProfile {
  id: number;
  user_id: number;
  hourly_rate: number;
  description: string;
  created_at: string;
  updated_at: string;
  users?: {
    id: number;
    name: string;
    email: string;
  };
}

// Update FormData interface to include coaching fee
interface FormData {
  // existing fields
  coachingFee?: number; // Add this field
}
```

### 2. Modify Coach Data Fetching in Booking Form

Replace or supplement the current coach availability fetching in `components/BookingForm.tsx`:

```typescript
// Add state for coach profiles
const [coachProfiles, setCoachProfiles] = useState<CoachProfile[]>([]);

// Fetch coach profiles
useEffect(() => {
  const fetchCoachProfiles = async () => {
    try {
      const res = await fetch('/api/coach-profiles');
      const profiles = await res.json();
      setCoachProfiles(profiles);
      
      // Transform to the format needed for coach selection
      const coachOptions = [
        { id: 'any', name: 'Any coach', hourly_rate: null },
        { id: 'none', name: 'None', hourly_rate: null },
        ...profiles.map(profile => ({ 
          id: profile.users?.name || `Coach ${profile.user_id}`, 
          name: profile.users?.name || `Coach ${profile.user_id}`,
          hourly_rate: profile.hourly_rate,
          profile_id: profile.id,
          user_id: profile.user_id
        }))
      ];
      
      setCoaches(coachOptions);
    } catch (error) {
      console.error('Error fetching coach profiles:', error);
    }
  };
  
  fetchCoachProfiles();
}, []);
```

### 3. Update BookingFormStep1 Component

Modify `components/booking/BookingFormStep1.tsx` to display coach hourly rates and calculate coaching fees:

```typescript
// Add to props interface
interface BookingFormStep1Props {
  // existing props
  coachProfiles: CoachProfile[];
}

// In the coach selection section
{formData.wantsCoach && (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-3">Select Coach</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {coaches.map((coach) => (
        <div 
          key={coach.id}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            formData.coach === coach.id ? 'bg-simstudio-yellow border-yellow-500' : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => handlePillSelection('coach', coach.id)}
        >
          <div className="font-medium">{coach.name}</div>
          {coach.hourly_rate && (
            <div className="text-sm text-gray-600 mt-1">
              ${coach.hourly_rate}/hour
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

// Add a section to display coaching fee calculation
{formData.wantsCoach && formData.coach !== 'none' && formData.coach !== 'any' && (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-medium mb-2">Coaching Fee</h3>
    <div className="flex justify-between">
      <span>Coach rate:</span>
      <span>${getSelectedCoachRate(formData.coach)}/hour</span>
    </div>
    <div className="flex justify-between">
      <span>Coaching hours:</span>
      <span>{formData.coachHours} hour{formData.coachHours !== 1 ? 's' : ''}</span>
    </div>
    <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-200">
      <span>Total coaching fee:</span>
      <span>${calculateCoachingFee(formData.coach, formData.coachHours)}</span>
    </div>
  </div>
)}
```

### 4. Update Booking API to Handle Coaching Fees

Modify `pages/api/bookings.ts` to calculate and store coaching fees:

```typescript
// In the POST handler for creating bookings
const { userId, simulatorId, startTime, endTime, coach, coachHours } = req.body;

// Calculate coaching fee if a coach is selected
let coachingFee = 0;
if (coach && coach !== 'none') {
  // Fetch coach profile to get hourly rate
  const { data: coachProfile } = await supabase
    .from('coach_profiles')
    .select('hourly_rate')
    .eq('user_id', coach)
    .single();
    
  if (coachProfile) {
    coachingFee = coachProfile.hourly_rate * coachHours;
  }
}

// Create booking with coaching fee
const { data, error } = await supabase
  .from('bookings')
  .insert({
    user_id: userId,
    simulator_id: simulatorId,
    start_time: startTime,
    end_time: endTime,
    coach,
    coach_hours: coachHours,
    coaching_fee: coachingFee
  })
  .select();
```

### 5. Update Payment Processing

Modify `pages/api/process-payment.ts` to handle coaching fees:

```typescript
// Add coaching fee to payment calculation
const { userId, bookingId, creditsToPurchase } = req.body;

let totalAmount = 0;
let description = '';

// If booking ID is provided, process coaching fee
if (bookingId) {
  const { data: booking } = await supabase
    .from('bookings')
    .select('coaching_fee')
    .eq('id', bookingId)
    .single();
    
  if (booking && booking.coaching_fee > 0) {
    totalAmount += booking.coaching_fee * 100; // Convert to cents for Square
    description += `Coaching fee for booking #${bookingId}`;
  }
}

// Add credits purchase if requested
if (creditsToPurchase && creditsToPurchase > 0) {
  const creditCost = creditsToPurchase * CREDIT_PRICE_CENTS;
  totalAmount += creditCost;
  
  if (description) {
    description += ' and ';
  }
  description += `${creditsToPurchase} simulator credit${creditsToPurchase !== 1 ? 's' : ''}`;
}
```

### 6. Update BookingFormStep3 Component

Modify `components/booking/BookingFormStep3.tsx` to display coaching fees in the confirmation step:

```typescript
// Add to session details display
<div className="mt-4 p-4 bg-gray-50 rounded-lg">
  <h3 className="text-lg font-medium mb-2">Session Summary</h3>
  
  {/* Simulator details */}
  <div className="mb-3">
    <div className="flex justify-between">
      <span>Simulator time:</span>
      <span>{formData.hours} hour{formData.hours !== 1 ? 's' : ''}</span>
    </div>
    <div className="flex justify-between">
      <span>Credits required:</span>
      <span>{formData.hours} credit{formData.hours !== 1 ? 's' : ''}</span>
    </div>
  </div>
  
  {/* Coaching details if applicable */}
  {formData.wantsCoach && formData.coach !== 'none' && (
    <div className="mb-3 pt-3 border-t border-gray-200">
      <div className="flex justify-between">
        <span>Coach:</span>
        <span>{getCoachName(formData.coach)}</span>
      </div>
      <div className="flex justify-between">
        <span>Coaching time:</span>
        <span>{formData.coachHours} hour{formData.coachHours !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex justify-between">
        <span>Coach rate:</span>
        <span>${getCoachRate(formData.coach)}/hour</span>
      </div>
      <div className="flex justify-between font-medium">
        <span>Coaching fee:</span>
        <span>${calculateCoachingFee(formData.coach, formData.coachHours)}</span>
      </div>
    </div>
  )}
  
  {/* Total cost */}
  <div className="pt-3 border-t border-gray-200">
    <div className="flex justify-between font-bold">
      <span>Total credits needed:</span>
      <span>{formData.hours} credit{formData.hours !== 1 ? 's' : ''}</span>
    </div>
    {formData.wantsCoach && formData.coach !== 'none' && (
      <div className="flex justify-between font-bold">
        <span>Total coaching fee:</span>
        <span>${calculateCoachingFee(formData.coach, formData.coachHours)}</span>
      </div>
    )}
  </div>
</div>
```

### 7. Update Booking Submission Logic

Modify the `handleSubmit` function in `components/BookingForm.tsx` to handle coaching fees:

```typescript
// In the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');
  setSuccess(false);

  try {
    // Existing validation code...
    
    // Calculate coaching fee
    let coachingFee = 0;
    if (formData.wantsCoach && selectedCoach !== 'none') {
      const coachProfile = coachProfiles.find(
        profile => profile.user_id.toString() === selectedCoach
      );
      
      if (coachProfile) {
        coachingFee = coachProfile.hourly_rate * formData.coachHours;
      }
    }
    
    // Check if payment for coaching is needed
    if (coachingFee > 0) {
      // Redirect to payment page with booking details
      router.push({
        pathname: '/checkout',
        query: {
          bookingDetails: JSON.stringify({
            userId: formData.userId,
            simulatorId: availableSimulator,
            startTime: selectedSession.startTime,
            endTime: selectedSession.endTime,
            coach: selectedCoach,
            coachHours: formData.coachHours,
            coachingFee: coachingFee
          })
        }
      });
      return;
    }
    
    // If no coaching fee, create booking directly
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: formData.userId,
        simulatorId: availableSimulator,
        startTime: selectedSession.startTime,
        endTime: selectedSession.endTime,
        coach: selectedCoach,
        coachHours: formData.coachHours,
        coachingFee: coachingFee
      })
    });
    
    // Rest of the function...
  } catch (err) {
    // Error handling...
  }
};
```

## Implementation Steps

1. **Update Booking Types**
   - Modify `lib/booking/types.ts` to include coach profile and fee information
   - Add helper functions for coach rate calculations

2. **Update Booking Form**
   - Modify `components/BookingForm.tsx` to fetch and use coach profiles
   - Update coach selection to display hourly rates
   - Add coaching fee calculation logic

3. **Update Booking API**
   - Modify `pages/api/bookings.ts` to calculate and store coaching fees
   - Update booking creation and retrieval to handle coaching fees

4. **Update Payment Flow**
   - Modify checkout process to handle coaching fees
   - Update payment confirmation to show coaching fee details

5. **Testing**
   - Test booking flow with different coaches and rates
   - Test payment processing for coaching fees
   - Test admin interface for managing coach profiles

## Technical Considerations

1. **Backwards Compatibility**
   - Maintain compatibility with existing bookings that don't have coaching fees
   - Handle cases where coach profiles don't exist for some coaches

2. **User Experience**
   - Clearly communicate the separate payment for coaching
   - Show breakdown of costs during booking
   - Provide clear confirmation of coaching fees

3. **Payment Processing**
   - Handle cases where a user has enough credits but payment for coaching fails
   - Consider implementing a hold on credits until coaching payment is confirmed
   - Provide clear error messages for payment failures
