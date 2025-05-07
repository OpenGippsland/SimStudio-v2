import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormData, Session, SessionDetails, CoachProfile } from '../../lib/booking/types';
import { useAuth } from '../../contexts/AuthContext';

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
  const [localError, setLocalError] = useState<string>('');
  const [localIsSubmitting, setLocalIsSubmitting] = useState<boolean>(false);
  
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
  
  // Get user information from auth context
  const { user, authUser, refreshUser } = useAuth();
  
  // Refresh auth state when component mounts (only once)
  useEffect(() => {
    refreshUser();
  }, []); // Empty dependency array ensures this runs only once on mount
  
  // Function to handle direct checkout with Square
  const handleProceedToCheckout = async () => {
    if (!selectedSession || !sessionDetails) return;
    
    try {
      setLocalIsSubmitting(true);
      
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
      
      // Get user information from auth context
      const userInfo = {
        email: user?.email || authUser?.email || '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        phoneNumber: user?.mobile_number || ''
      };
      
      // Create checkout session directly with Square
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: (creditsNeeded * 50) + (coachingFee || 0),
          userId: formData.userId,
          isAuthenticated: true,
          description: coachingFee 
            ? `SimStudio Booking - ${creditsNeeded} hours + Coaching Fee`
            : `SimStudio Booking - ${creditsNeeded} hours`,
          fromBooking: true,
          totalHours: creditsNeeded,
          coachingFee: coachingFee,
          bookingDetails: {
            date: formData.date,
            time: time,
            coach: formData.coach,
            bookingId: bookingId
          },
          userInfo: userInfo
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout');
      }
      
      const data = await response.json();
      
      // Redirect to Square Checkout
      window.location.href = data.checkoutUrl;
      
    } catch (error) {
      console.error('Error creating checkout:', error);
      setLocalError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLocalIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 3/3: Review session details and confirm</h2>
      
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
            
            {/* Credits and Payment Information */}
            <div className="mt-3">
              {selectedUserCredits !== null && (
                <p className="text-gray-800">
                  Available Credits: {selectedUserCredits} hours
                </p>
              )}
              
              {/* Payment Required Notice */}
              {((selectedUserCredits !== null && selectedUserCredits < sessionDetails.hours) || 
                (formData.wantsCoach && coachingFee && coachingFee > 0 && !formData.paidCoachingFee)) && (
                <div className="mt-2 p-4 bg-yellow-50 rounded-lg border-2 border-simstudio-yellow">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-simstudio-yellow mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-black font-semibold">Payment Required</h4>
                      
                      {selectedUserCredits !== null && selectedUserCredits < sessionDetails.hours && (
                        <p className="text-sm text-black mt-1">
                          You need {sessionDetails.hours - selectedUserCredits} more credit hours for this booking.
                        </p>
                      )}
                      
                      {formData.wantsCoach && coachingFee && coachingFee > 0 && !formData.paidCoachingFee && (
                        <p className="text-sm text-black mt-1">
                          Coaching fee: ${coachingFee.toFixed(2)} for {formData.coachHours} hour{formData.coachHours !== 1 ? 's' : ''} with {formData.coach}.
                        </p>
                      )}
                      
                      <p className="text-sm text-black mt-1">
                        When you click "PROCEED TO CHECKOUT", you'll be taken to Square's secure payment page.
                      </p>
                      
                      <p className="text-sm text-black mt-1">
                        Your booking will be automatically confirmed once payment is complete.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment Completed Notice */}
              {formData.paidCoachingFee && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-green-800 font-medium">Payment Completed</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your payment has been processed successfully. Click "CONFIRM BOOKING" to finalize your reservation.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {(error || localError) && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error || localError}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold mb-2">Success! See you soon</h3>
          <p className="mb-4">Your booking has been confirmed and you will receive a confirmation email shortly.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <a
              href="/booking"
              className="py-3 px-4 bg-simstudio-yellow text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors text-center"
            >
              Make another booking
            </a>
            <a
              href="/my-account"
              className="py-3 px-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              See my bookings
            </a>
            <a
              href="/about"
              className="py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              More information
            </a>
            <a
              href="/"
              className="py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Return to home
            </a>
          </div>
        </div>
      )}
      
      {/* Buttons section */}
      {!success && (
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="py-3 px-6 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={
              (selectedUserCredits !== null && selectedUserCredits < (sessionDetails?.hours || 0)) || 
              (formData.wantsCoach && coachingFee && coachingFee > 0 && !formData.paidCoachingFee)
                ? handleProceedToCheckout
                : handleSubmit
            }
            disabled={isSubmitting || localIsSubmitting}
            className={`py-3 px-6 font-bold rounded-lg transition-colors ${
              isSubmitting || localIsSubmitting
                ? 'bg-yellow-300 text-black cursor-not-allowed opacity-70'
                : 'bg-simstudio-yellow text-black hover:bg-yellow-500'
            }`}
          >
            {isSubmitting || localIsSubmitting ? 'Processing...' : 
              ((selectedUserCredits !== null && selectedUserCredits < (sessionDetails?.hours || 0)) || 
              (formData.wantsCoach && coachingFee && coachingFee > 0 && !formData.paidCoachingFee)) 
                ? 'PROCEED TO CHECKOUT' 
                : 'CONFIRM BOOKING'
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingFormStep3;
