import React, { useState, useEffect } from 'react';
import PillSelector from '../ui/PillSelector';
import { FormData } from '../../lib/booking/types';

interface BookingFormStep1Props {
  formData: FormData;
  handlePillSelection: (field: string, value: string | number | boolean) => void;
  handleFindSessions: () => void;
  selectedUserCredits: number | null;
  error?: string;
}

const BookingFormStep1: React.FC<BookingFormStep1Props> = ({
  formData,
  handlePillSelection,
  handleFindSessions,
  selectedUserCredits,
  error
}) => {
  // Duration options
  const durationOptions = [
    { value: 1, label: '1h' },
    { value: 2, label: '2h' },
    { value: 3, label: '3h' },
    { value: 4, label: '4h' }
  ];

  // Coach duration options
  const coachDurationOptions = [
    { value: 1, label: '1h' },
    { value: 2, label: '2h' }
  ];

  // Yes/No options for coach selection
  const yesNoOptions = [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ];

  // Coach selection options
  const [coachOptions, setCoachOptions] = useState([
    { value: 'any', label: 'Any' }
  ]);

  // Fetch coaches on component mount
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch('/api/coach-availability?format=coaches');
        const coaches = await res.json();
        
        // Transform to the format needed for PillSelector
        const options = [
          { value: 'any', label: 'Any' },
          ...coaches.map(coach => ({ value: coach, label: coach }))
        ];
        
        setCoachOptions(options);
      } catch (error) {
        console.error('Error fetching coaches:', error);
      }
    };
    
    fetchCoaches();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 heading-font">New Booking</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-3">Simulator Duration:</label>
        <PillSelector
          options={durationOptions}
          selectedValue={formData.hours}
          onChange={(value) => handlePillSelection('hours', value)}
          name="hours"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-3">Do you want a coach?</label>
        <PillSelector
          options={yesNoOptions}
          selectedValue={formData.wantsCoach}
          onChange={(value) => handlePillSelection('wantsCoach', value)}
          name="wantsCoach"
        />
      </div>
      
      {formData.wantsCoach && (
        <>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Select Coach:</label>
            <PillSelector
              options={coachOptions}
              selectedValue={formData.coach}
              onChange={(value) => handlePillSelection('coach', value)}
              name="coach"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-3">Coach Duration:</label>
            <PillSelector
              options={coachDurationOptions}
              selectedValue={formData.coachHours}
              onChange={(value) => handlePillSelection('coachHours', value)}
              name="coachHours"
            />
          </div>
        </>
      )}
      
      {selectedUserCredits !== null && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-800 font-medium">
            Available Credits: {selectedUserCredits} hours
          </p>
          {formData.hours > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              This booking will use {formData.hours} {formData.hours === 1 ? 'hour' : 'hours'}
            </p>
          )}
          {selectedUserCredits < formData.hours && (
            <p className="text-sm text-red-600 mt-2 font-medium">
              Warning: Not enough credits for this booking!
            </p>
          )}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleFindSessions}
        className="w-full py-3 px-6 bg-simstudio-yellow text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
      >
        FIND AVAILABLE SESSIONS
      </button>
    </div>
  );
};

export default BookingFormStep1;
