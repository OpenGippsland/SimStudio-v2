import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

// Import types
import { 
  BookingFormProps, 
  FormData, 
  Session, 
  SessionsByDate 
} from '../lib/booking/types';

// Import utility functions
import { 
  isCoachAvailable, 
  isDateClosed as isDateClosedUtil, 
  isCoachBooked, 
  generateAvailableSessions, 
  formatSessionDetails 
} from '../lib/booking/utils';

// Import step components
import BookingFormStep1 from './booking/BookingFormStep1';
import BookingFormStep2 from './booking/BookingFormStep2';
import BookingFormStep3 from './booking/BookingFormStep3';

export default function BookingForm({ onSuccess, selectedUserId }: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1, 2, or 3 for the three steps
  const [businessHours, setBusinessHours] = useState<any[]>([]);
  const [specialDates, setSpecialDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [coachAvailability, setCoachAvailability] = useState<any>({});
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    userId: '',
    hours: 1, // Default to 1 hour
    wantsCoach: false, // Default to no coach
    coach: 'none',
    coachHours: 1, // Default to 1 hour if coach is selected
    date: '',
    sessionTime: '' // Selected session time slot
  });
  
  // For session selection
  const [availableSessions, setAvailableSessions] = useState<SessionsByDate>({});
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  // Update formData.userId when selectedUserId prop changes
  useEffect(() => {
    if (selectedUserId) {
      setFormData(prev => ({
        ...prev,
        userId: selectedUserId
      }));
    }
  }, [selectedUserId]);
  
  // Handle returning from cart/checkout with booking details
  useEffect(() => {
    // Check if we're returning from checkout with booking details
    if (router.query.fromBooking || router.query.fromCheckout) {
      const { date, time, hours, coach } = router.query;
      
      if (date && time) {
        // Restore form data from URL parameters
        setFormData(prev => ({
          ...prev,
          date: date as string,
          sessionTime: `${date}T${time}:00`,
          hours: hours ? parseInt(hours as string) : prev.hours,
          coach: coach as string || 'none',
          wantsCoach: coach !== 'none'
        }));
        
        // Fetch available sessions and move to step 3
        const fetchAndRestoreSession = async () => {
          try {
            // Create updated form data
            const updatedFormData: FormData = {
              ...formData,
              date: date as string,
              hours: hours ? parseInt(hours as string) : formData.hours,
              coach: coach as string || 'none',
              wantsCoach: coach !== 'none'
            };
            
            // Generate available sessions
            const sessions = generateAvailableSessions(
              businessHours,
              specialDates,
              coachAvailability,
              existingBookings,
              updatedFormData
            );
            
            setAvailableSessions(sessions);
            
            // Find the selected session
            const dateKey = new Date(date as string).toISOString().split('T')[0];
            if (sessions[dateKey]) {
              const timeStr = time as string;
              const sessionTime = `${date}T${timeStr}:00`;
              
              const foundSession = sessions[dateKey].find(
                session => new Date(session.startTime).toISOString() === new Date(sessionTime).toISOString()
              );
              
              if (foundSession) {
                setSelectedSession(foundSession);
                // Move directly to step 3 (confirmation)
                setStep(3);
              }
            }
          } catch (error) {
            console.error('Error restoring session:', error);
          }
        };
        
        if (!loading && businessHours.length > 0 && Object.keys(coachAvailability).length > 0) {
          fetchAndRestoreSession();
        }
      }
    }
  }, [router.query, loading, businessHours, specialDates, coachAvailability, existingBookings]);
  
  const [selectedUserCredits, setSelectedUserCredits] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coach options
  const [coaches, setCoaches] = useState([
    { id: 'any', name: 'Any coach' },
    { id: 'none', name: 'None' }
  ]);

  // Fetch coaches on component mount
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('/api/coach-availability?format=coaches');
        const coachIds = await res.json();
        
        // Transform to the format needed
        const coachOptions = [
          { id: 'any', name: 'Any coach' },
          { id: 'none', name: 'None' },
          ...coachIds.map(id => ({ id, name: id }))
        ];
        
        setCoaches(coachOptions);
      } catch (error) {
        console.error('Error fetching coaches:', error);
      }
    };
    
    fetchCoaches();
  }, []);

  // Fetch business hours and special dates on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch business hours
        const businessHoursResponse = await fetch('/api/business-hours');
        if (!businessHoursResponse.ok) {
          throw new Error('Failed to fetch business hours');
        }
        const businessHoursData = await businessHoursResponse.json();
        setBusinessHours(businessHoursData);

        // Fetch special dates
        const specialDatesResponse = await fetch('/api/special-dates');
        if (!specialDatesResponse.ok) {
          throw new Error('Failed to fetch special dates');
        }
        const specialDatesData = await specialDatesResponse.json();
        setSpecialDates(specialDatesData);

        // Fetch existing bookings
        const bookingsResponse = await fetch('/api/bookings');
        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const bookingsData = await bookingsResponse.json();
        setExistingBookings(bookingsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch coach availability data
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        // Use the grouped format for the booking system
        const coachResponse = await fetch('/api/coach-availability?format=grouped');
        if (!coachResponse.ok) {
          throw new Error('Failed to fetch coach availability');
        }
        const coachData = await coachResponse.json();
        setCoachAvailability(coachData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coach data:', error);
        setLoading(false);
      }
    };

    fetchCoachData();
  }, []);

  // Update selected user credits when user changes
  useEffect(() => {
    if (selectedUserId) {
      setSelectedUserCredits(null);
      const fetchUsers = async () => {
        try {
          const usersResponse = await fetch('/api/users');
          if (!usersResponse.ok) {
            throw new Error('Failed to fetch users');
          }
          const usersData = await usersResponse.json();
          const selectedUser = usersData.find(user => user.id.toString() === selectedUserId);
          setSelectedUserCredits(selectedUser?.simulator_hours || 0);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchUsers();
    } else {
      setSelectedUserCredits(null);
    }
  }, [selectedUserId]);

  // Function to check if a date is closed
  const isDateClosed = useMemo(() => {
    return (dateString: string) => {
      return isDateClosedUtil(
        dateString, 
        businessHours, 
        specialDates, 
        coachAvailability, 
        formData.coach
      );
    };
  }, [businessHours, specialDates, coachAvailability, formData.coach]);

  // Handle pill selection for form fields
  const handlePillSelection = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset selected session when changing duration or coach options
    if (['hours', 'wantsCoach', 'coach', 'coachHours'].includes(field)) {
      setSelectedSession(null);
    }
    
    // If coach is toggled off, reset coach selection
    if (field === 'wantsCoach' && value === false) {
      setFormData(prev => ({
        ...prev,
        coach: 'none',
        coachHours: 1
      }));
    }
    
    // If coach is toggled on, set default coach to 'any'
    if (field === 'wantsCoach' && value === true) {
      setFormData(prev => ({
        ...prev,
        coach: 'any'
      }));
    }
  };

  // Handle session selection
  const handleSessionSelection = (session: Session) => {
    setSelectedSession(session);
    
    // Extract date from the session start time
    const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      date: sessionDate,
      sessionTime: session.startTime
    }));
  };

  // Handle finding available sessions
  const handleFindSessions = () => {
    setError('');
    
    // Check if user is logged in and has enough credits
    if (formData.userId && selectedUserCredits !== null && selectedUserCredits < formData.hours) {
      // Redirect to cart page with booking details
      router.push({
        pathname: '/cart',
        query: { 
          hours: formData.hours,
          userId: formData.userId,
          fromBooking: true,
          message: 'You need to purchase more credits to book this session.'
        }
      });
      return;
    }
    
    // Check if coach is selected but no coach availability data exists
    if (formData.wantsCoach && formData.coach !== 'none' && formData.coach !== 'any') {
      const coachData = coachAvailability[formData.coach];
      if (!coachData || !Array.isArray(coachData) || coachData.length === 0) {
        setError(`No availability data found for coach ${formData.coach}. Please select a different coach or contact an administrator.`);
        return;
      }
    }
    
    // Generate available sessions based on current form data
    const sessions = generateAvailableSessions(
      businessHours,
      specialDates,
      coachAvailability,
      existingBookings,
      formData
    );
    setAvailableSessions(sessions);
    
    // Check if any sessions were found
    if (Object.keys(sessions).length === 0) {
      if (formData.wantsCoach && formData.coach !== 'none') {
        setError(`No available sessions found with the selected coach (${formData.coach}). Try selecting a different coach or different hours.`);
        return;
      } else {
        setError('No available sessions found for the selected criteria. Please try different options.');
        return;
      }
    }
    
    // Move to step 2
    setStep(2);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      if (!selectedSession) {
        throw new Error('Please select a session time');
      }
      
      if (!selectedSession.isAvailable) {
        throw new Error('Selected session is not available. Please select an available session.');
      }
      
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

      // Check if user is logged in
      if (!formData.userId) {
        // Redirect to login page with booking details in URL
        const time = new Date(selectedSession.startTime).toTimeString().split(' ')[0].substring(0, 5);
        window.location.href = `/auth/login?redirect=/booking&fromBooking=true&date=${formData.date}&time=${time}&hours=${formData.hours}&coach=${formData.wantsCoach ? formData.coach : 'none'}`;
        return;
      }
      
      // If "any" coach is selected, find an available coach
      let selectedCoach = formData.wantsCoach ? formData.coach : 'none';
      
      if (formData.wantsCoach && formData.coach === 'any') {
        // Get all coaches (excluding 'any' and 'none')
        const availableCoaches = Object.keys(coachAvailability).filter(
          coachId => coachId !== 'any' && coachId !== 'none'
        );
        
        // Find the first available coach for this time slot
        const coachStartTime = new Date(startDate);
        const coachEndTime = new Date(startDate);
        coachEndTime.setHours(coachEndTime.getHours() + formData.coachHours);
        
        for (const coachId of availableCoaches) {
          // Check if coach is available for the required hours
          const startHour = startDate.getHours();
          if (!isCoachAvailable(
            coachId, 
            startDate.toISOString().split('T')[0], 
            startHour, 
            startHour + formData.coachHours, 
            coachAvailability
          )) {
            continue;
          }
          
          // Check if coach is not already booked
          if (!isCoachBooked(coachId, coachStartTime, coachEndTime, allBookings)) {
            selectedCoach = coachId;
            break;
          }
        }
        
        // If no coach is available, throw an error
        if (selectedCoach === 'any') {
          throw new Error('No coaches are available for the selected time slot. Please choose a different time.');
        }
      }
      
      // Create the booking
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
          coachHours: formData.coachHours // Pass coach hours to the API
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      setSuccess(true);
      setFormData({
        userId: selectedUserId || '', // Keep the userId
        hours: 1,
        wantsCoach: false,
        coach: 'none',
        coachHours: 1,
        date: '',
        sessionTime: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get session details for confirmation
  const sessionDetails = useMemo(() => {
    return formatSessionDetails(selectedSession, formData);
  }, [selectedSession, formData]);

  // Function to reset form state for a new booking
  const resetFormForNewBooking = () => {
    setStep(1);
    setError('');
    setSuccess(false);
    setSelectedSession(null);
    setFormData({
      userId: selectedUserId || '',
      hours: 1,
      wantsCoach: false,
      coach: 'none',
      coachHours: 1,
      date: '',
      sessionTime: ''
    });
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BookingFormStep1
            formData={formData}
            handlePillSelection={handlePillSelection}
            handleFindSessions={handleFindSessions}
            selectedUserCredits={selectedUserCredits}
            error={error}
          />
        );
        
      case 2:
        return (
          <BookingFormStep2
            formData={formData}
            availableSessions={availableSessions}
            selectedSession={selectedSession}
            handleSessionSelection={handleSessionSelection}
            setStep={setStep}
            isDateClosed={isDateClosed}
          />
        );
        
      case 3:
        return (
          <BookingFormStep3
            formData={formData}
            selectedSession={selectedSession}
            sessionDetails={sessionDetails}
            selectedUserCredits={selectedUserCredits}
            error={error}
            success={success}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            setStep={(step) => {
              // If going back to step 1 after success, reset the form
              if (step === 1 && success) {
                resetFormForNewBooking();
              } else {
                setStep(step);
              }
            }}
          />
        );
        
      default:
        return null;
    }
  };

  // Check if user is logged in
  const isLoggedIn = !!formData.userId;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="bg-white p-8 rounded-lg shadow-md mb-8 border border-gray-100">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-simstudio-yellow border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading booking system...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Only show login warning if user is not logged in and booking is not successful */}
          {!isLoggedIn && !success && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Login required:</strong> You can browse available sessions, but you must be logged in to complete a booking.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Only apply opacity if user is not logged in and booking is not successful */}
          <div className={!isLoggedIn && !success ? "opacity-70 pointer-events-none" : ""}>
            {renderStep()}
          </div>
          
          {/* Only show login/register buttons if user is not logged in and booking is not successful */}
          {!isLoggedIn && !success && (
            <div className="mt-6 flex justify-center space-x-4">
              <a href="/auth/login?redirect=/booking" className="px-4 py-2 bg-simstudio-yellow text-black rounded hover:bg-yellow-400 transition">
                Sign In
              </a>
              <a href="/auth/register?redirect=/booking" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
                Create Account
              </a>
            </div>
          )}
        </>
      )}
    </form>
  );
}
