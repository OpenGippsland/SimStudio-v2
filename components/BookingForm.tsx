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

      // Check if user is selected (logged in)
      if (!formData.userId) {
        // If no user is selected, redirect to cart page
        router.push({
          pathname: '/cart',
          query: {
            hours: formData.hours,
            date: formData.date,
            time: new Date(selectedSession.startTime).toTimeString().split(' ')[0].substring(0, 5),
            coach: formData.wantsCoach ? formData.coach : 'none'
          }
        });
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
        userId: '',
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
            setStep={setStep}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded-lg shadow-md mb-8">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        renderStep()
      )}
    </form>
  );
}
