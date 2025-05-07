import React, { useState, useEffect } from 'react';
import PillSelector from '../ui/PillSelector';
import { FormData, Coach, CoachProfile } from '../../lib/booking/types';

interface BookingFormStep1Props {
  formData: FormData;
  handlePillSelection: (field: string, value: string | number | boolean) => void;
  handleFindSessions: () => void;
  selectedUserCredits: number | null;
  error?: string;
  updateFormData?: (updates: Partial<FormData>) => void;
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

  // Yes/No options for coach selection
  const yesNoOptions = [
    { value: false, label: 'No' },
    { value: true, label: 'Yes' }
  ];

  // Coach selection options with rates
  const [coachOptions, setCoachOptions] = useState<{value: string, label: string}[]>([]);
  
  // Coach profiles and rates
  const [coachProfiles, setCoachProfiles] = useState<CoachProfile[]>([]);
  const [coachRates, setCoachRates] = useState<Record<string, number>>({});

  // Fetch coaches and their rates on component mount
  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        // Fetch coach availability for session scheduling
        const availRes = await fetch('/api/coach-availability?format=coaches');
        const coaches = await availRes.json();
        
        // Fetch coach profiles to get rates
        const profilesRes = await fetch('/api/coach-profiles');
        const profiles = await profilesRes.json();
        setCoachProfiles(profiles);
        
        // Create a map of coach names to their rates
        const ratesMap: Record<string, number> = {};
        
        // Map coach IDs to names and rates
        profiles.forEach((profile: CoachProfile) => {
          if (profile.users?.name) {
            ratesMap[profile.users.name] = profile.hourly_rate;
          }
        });
        
        setCoachRates(ratesMap);
        
        // Transform to the format needed for PillSelector
        const options = coaches.map((coach: string) => ({ 
          value: coach, 
          label: `${coach}${ratesMap[coach] ? ` ($${ratesMap[coach]}/hr)` : ''}` 
        }));
        
        setCoachOptions(options);
      } catch (error) {
        console.error('Error fetching coach data:', error);
      }
    };
    
    fetchCoachData();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 1/3: Choose your session type and length</h2>
      
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-simstudio-yellow">
        <div className="flex items-start">
          <span className="text-2xl mr-3">💡</span>
          <div>
            <p className="text-black font-semibold">
              Save more: purchase hour packs for volume discounts.
            </p>
            <a href="/packages" className="mt-1 inline-block text-black hover:underline font-medium">
              Browse Packs <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
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
          
        </>
      )}
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        {selectedUserCredits !== null ? (
          <>
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
          </>
        ) : (
          <>
            <p className="text-gray-800 font-medium">
              Guest Booking
            </p>
            <p className="text-sm text-gray-600 mt-2">
              You'll need to purchase {formData.hours} {formData.hours === 1 ? 'hour' : 'hours'} during checkout.
            </p>
          </>
        )}
        
        {/* Display coaching fee if a coach is selected */}
        {formData.wantsCoach && coachRates[formData.coach] && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-gray-800 font-medium">
              Coaching Fee
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Coach rate: ${coachRates[formData.coach]}/hour
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total coaching fee: ${(coachRates[formData.coach] * formData.coachHours).toFixed(2)}
              {formData.coachHours > 0 ? ` (${formData.coachHours} ${formData.coachHours === 1 ? 'hour' : 'hours'})` : ''}
            </p>
          </div>
        )}
      </div>
      
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
