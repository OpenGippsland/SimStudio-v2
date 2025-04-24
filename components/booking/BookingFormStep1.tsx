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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">New Booking</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Simulator Duration:</label>
        <PillSelector
          options={durationOptions}
          selectedValue={formData.hours}
          onChange={(value) => handlePillSelection('hours', value)}
          name="hours"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Do you want a coach?</label>
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
            <label className="block text-gray-700 mb-2">Select Coach:</label>
            <PillSelector
              options={coachOptions}
              selectedValue={formData.coach}
              onChange={(value) => handlePillSelection('coach', value)}
              name="coach"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Coach Duration:</label>
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
        <div className="mb-6 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-blue-800 font-medium">
            Available Credits: {selectedUserCredits} hours
          </p>
          {formData.hours > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              This booking will use {formData.hours} {formData.hours === 1 ? 'hour' : 'hours'}
            </p>
          )}
          {selectedUserCredits < formData.hours && (
            <p className="text-sm text-red-600 mt-1 font-medium">
              Warning: Not enough credits for this booking!
            </p>
          )}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleFindSessions}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Find Available Sessions
      </button>
    </div>
  );
};

export default BookingFormStep1;
