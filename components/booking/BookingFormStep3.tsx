import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormData, Session, SessionDetails, CoachProfile } from '../../lib/booking/types';

interface BookingFormStep3Props {
  formData: FormData;
  selectedSession: Session | null;
  sessionDetails: SessionDetails | null;
  selectedUserCredits: number | null;
  error: string;
  success: boolean;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  setStep: (step: number) => void;
}

const BookingFormStep3: React.FC<BookingFormStep3Props> = ({
  formData,
  selectedSession,
  sessionDetails,
  selectedUserCredits,
  error,
  success,
  isSubmitting,
  handleSubmit,
  setStep
}) => {
  const router = useRouter();
  const [coachRate, setCoachRate] = useState<number | null>(null);
  const [coachingFee, setCoachingFee] = useState<number | null>(null);
  
  // Fetch coach rate if a coach is selected
  useEffect(() => {
    const fetchCoachRate = async () => {
      if (formData.wantsCoach && formData.coach) {
        try {
          const res = await fetch('/api/coach-profiles');
          const profiles = await res.json();
          
          // Find the profile for the selected coach
          const coachProfile = profiles.find((profile: CoachProfile) => 
            profile.users?.name === formData.coach
          );
          
          if (coachProfile) {
            const rate = coachProfile.hourly_rate;
            const fee = rate * formData.coachHours;
            
            setCoachRate(rate);
            setCoachingFee(fee);
            
            // Update formData with coaching fee if not already set
            if (formData.coachingFee === undefined) {
              formData.coachingFee = fee;
            }
          }
        } catch (error) {
          console.error('Error fetching coach rate:', error);
        }
      } else {
        setCoachRate(null);
        setCoachingFee(null);
        formData.coachingFee = undefined;
      }
    };
    
    fetchCoachRate();
  }, [formData.coach, formData.coachHours, formData.wantsCoach]);
  
  // Function to handle redirection to cart for credit purchase or coaching fee
  const handleProceedToCheckout = async () => {
    if (!selectedSession || !sessionDetails) return;
    
    try {
      // Calculate how many credits are needed (if any)
      const creditsNeeded = selectedUserCredits !== null ? 
        Math.max(0, sessionDetails.hours - selectedUserCredits) : 
        sessionDetails.hours;
      
      // Create a temporary booking with pending status
      const startDate = new Date(selectedSession.startTime);
      const endDate = new Date(selectedSession.endTime);
      
      // Find first available simulator (1-4)
      const bookingsResponse = await fetch('/api/bookings');
      const allBookings = await bookingsResponse.json();
      
      let availableSimulator = 1;
      const bookedSimulators = allBookings
        .filter((b: any) => {
          const bStart = new Date(b.start_time);
          const bEnd = new Date(b.end_time);
          return (startDate < bEnd && endDate > bStart);
        })
        .map((b: any) => b.simulator_id);

      while (bookedSimulators.includes(availableSimulator) && availableSimulator <= 4) {
        availableSimulator++;
      }

      if (availableSimulator > 4) {
        throw new Error('No available simulators for selected time');
      }
      
      // Create a temporary booking to get a booking ID
      const tempBookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: formData.userId,
          simulatorId: availableSimulator,
          startTime: selectedSession.startTime,
          endTime: selectedSession.endTime,
          coach: formData.coach,
          coachHours: formData.coachHours,
          coachingFee: coachingFee || 0,
          payment_status: 'pending', // Mark as pending payment
          isTemporaryBooking: true // Flag to bypass credit check
        })
      });
      
      if (!tempBookingResponse.ok) {
        const errorData = await tempBookingResponse.json();
        throw new Error(errorData.error || 'Failed to create temporary booking');
      }
      
      const tempBookingData = await tempBookingResponse.json();
      const bookingId = tempBookingData.id;
      
      console.log('Created temporary booking with ID:', bookingId);
      
      // Format time for URL
      const time = new Date(selectedSession.startTime).toTimeString().split(' ')[0].substring(0, 5);
      
      // Determine appropriate message based on what the user needs to purchase
      let message = '';
      if (creditsNeeded > 0 && (coachingFee && coachingFee > 0)) {
        message = `You need to purchase ${creditsNeeded} simulator hours and pay the coaching fee to complete this booking.`;
      } else if (creditsNeeded > 0) {
        message = `You need to purchase ${creditsNeeded} simulator hours to complete this booking.`;
      } else if (coachingFee && coachingFee > 0) {
        message = `You need to pay the coaching fee to complete this booking.`;
      }
      
      // Redirect to cart with booking details
      router.push({
        pathname: '/cart',
        query: {
          hours: creditsNeeded, // Only include hours that are actually needed
          userId: formData.userId,
          date: formData.date,
          time: time,
          coach: formData.coach,
          coachingFee: coachingFee || undefined,
          fromBooking: true,
          bookingId: bookingId, // Pass the booking ID to the cart
          message: message
        }
      });
    } catch (error) {
      console.error('Error creating temporary booking:', error);
      // If there's an error, still redirect to cart but without booking ID
      router.push({
        pathname: '/cart',
        query: {
          hours: Math.max(sessionDetails.hours - (selectedUserCredits || 0), 0),
          userId: formData.userId,
          date: formData.date,
          time: new Date(formData.sessionTime).toTimeString().split(' ')[0].substring(0, 5),
          coach: formData.coach,
          coachingFee: coachingFee || undefined,
          fromBooking: true,
          message: 'You need to purchase credits to complete this booking.'
        }
      });
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 heading-font">Booking Confirmation</h2>
      
      {sessionDetails && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-bold mb-4 text-simstudio-yellow">Session Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Date:</span> {sessionDetails.date}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Time:</span> {sessionDetails.time}
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Simulator:</span> {sessionDetails.hours} hour{sessionDetails.hours !== 1 ? 's' : ''}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Coach:</span> {sessionDetails.coach === 'None' ? 'None' : (
                  <>
                    {sessionDetails.coach} for 1 hour
                    {' '}({new Date(selectedSession!.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })} - {new Date(new Date(selectedSession!.startTime).getTime() + sessionDetails.coachHours * 60 * 60 * 1000).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })})
                  </>
                )}
              </p>
            </div>
          </div>
          
          {/* Booking Summary Section */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
            <h4 className="font-bold text-gray-800 mb-3">Booking Summary</h4>
            
            {/* Simulator Hours */}
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Simulator ({sessionDetails.hours} {sessionDetails.hours === 1 ? 'hour' : 'hours'})</span>
              <span className="text-gray-700">
                {selectedUserCredits !== null ? `${sessionDetails.hours} credits` : '$' + (sessionDetails.hours * 50).toFixed(2)}
              </span>
            </div>
            
          {/* Coach Fee if applicable */}
          {formData.wantsCoach && coachRate && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">
                Coaching ({formData.coachHours} {formData.coachHours === 1 ? 'hour' : 'hours'} @ ${coachRate}/hr)
              </span>
              <span className="text-gray-700">
                {formData.paidCoachingFee ? 
                  <span className="text-green-600 font-medium">${coachingFee?.toFixed(2)} (Paid)</span> : 
                  `$${coachingFee?.toFixed(2)}`
                }
              </span>
            </div>
          )}
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Total */}
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                {selectedUserCredits !== null 
                  ? `${sessionDetails.hours} credits${coachingFee ? ` + $${coachingFee.toFixed(2)}` : ''}`
                  : `$${((sessionDetails.hours * 50) + (coachingFee || 0)).toFixed(2)}`
                }
              </span>
            </div>
            
            {/* Breakdown explanation */}
            <div className="mt-2 text-xs text-gray-500">
              <p>Simulator time: {sessionDetails.hours} {sessionDetails.hours === 1 ? 'hour' : 'hours'} 
                {selectedUserCredits !== null ? ' (using credits)' : ` ($${(sessionDetails.hours * 50).toFixed(2)})`}
              </p>
              {coachingFee && coachingFee > 0 && (
                <p>Coaching fee: ${coachingFee.toFixed(2)} (paid separately)</p>
              )}
            </div>
            
            {/* Credits Warning */}
            {selectedUserCredits !== null && (
              <div className="mt-3">
                <p className="text-gray-800">
                  Available Credits: {selectedUserCredits} hours
                </p>
                {selectedUserCredits < sessionDetails.hours && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-800 font-medium">
                      You need {sessionDetails.hours - selectedUserCredits} more credit hours for this booking.
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      When you click "PROCEED TO CHECKOUT", you'll be taken to the checkout page to purchase the additional credits
                      {formData.wantsCoach && coachingFee && coachingFee > 0 && !formData.paidCoachingFee 
                        ? ' and pay the coaching fee' 
                        : ''}.
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your booking will be automatically confirmed once payment is complete.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <p className="font-bold">Booking created successfully!</p>
          <p className="mt-2">You will receive a confirmation email shortly.</p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        {success ? (
          <a
            href="/booking"
            target="_self"
            rel="noopener noreferrer"
            className="py-3 px-6 bg-simstudio-yellow text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors inline-block text-center"
            style={{ pointerEvents: 'auto', cursor: 'pointer' }}
          >
            CREATE ANOTHER BOOKING
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="py-3 px-6 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
        )}
        
        {!success && (
          <button
            type="button"
            onClick={
              // If user doesn't have enough credits or needs to pay coaching fee, redirect to checkout
              (selectedUserCredits !== null && selectedUserCredits < (sessionDetails?.hours || 0)) || 
              (formData.wantsCoach && coachingFee && coachingFee > 0 && !formData.paidCoachingFee)
                ? handleProceedToCheckout
                : handleSubmit
            }
            disabled={isSubmitting}
            className={`py-3 px-6 font-bold rounded-lg transition-colors ${
              isSubmitting
                ? 'bg-yellow-300 text-black cursor-not-allowed opacity-70'
                : 'bg-simstudio-yellow text-black hover:bg-yellow-500'
            }`}
          >
            {isSubmitting ? 'Processing...' : 
              ((selectedUserCredits !== null && selectedUserCredits < (sessionDetails?.hours || 0)) || 
              (formData.wantsCoach && coachingFee && coachingFee > 0 && !formData.paidCoachingFee)) 
                ? 'PROCEED TO CHECKOUT' 
                : 'CONFIRM BOOKING'
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingFormStep3;
