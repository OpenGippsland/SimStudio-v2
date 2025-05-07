import React, { useMemo } from 'react';
import SessionCard from '../ui/SessionCard';
import { FormData, Session, SessionsByDate } from '../../lib/booking/types';

interface BookingFormStep2Props {
  formData: FormData;
  availableSessions: SessionsByDate;
  selectedSession: Session | null;
  handleSessionSelection: (session: Session) => void;
  setStep: (step: number) => void;
  isDateClosed: (dateString: string) => boolean;
}

const BookingFormStep2: React.FC<BookingFormStep2Props> = ({
  formData,
  availableSessions,
  selectedSession,
  handleSessionSelection,
  setStep
}) => {
  // Sort dates chronologically and prepare data for display
  const sortedDates = useMemo(() => {
    // Filter out dates with no sessions or only unavailable sessions when debug mode is off
    const showUnavailableSessions = typeof window !== 'undefined' && 
      process.env.NEXT_PUBLIC_SHOW_UNAVAILABLE_SESSIONS === 'true';
    
    return Object.entries(availableSessions)
      .filter(([_, sessions]) => {
        // If debug mode is on, show all dates
        if (showUnavailableSessions) return true;
        
        // Otherwise, only show dates with at least one available session
        return sessions.some(session => session.isAvailable);
      })
      .sort(([dateA], [dateB]) => {
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
  }, [availableSessions]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2/3: Find available sessions</h2>
      
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-gray-700">
          Select a date and time that works for you. Available sessions are shown below.
        </p>
      </div>
      
      {/* Top Refine button */}
      <div className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-lg">
        <p className="text-gray-700">
          <span className="font-medium">Your selection:</span> {formData.hours} hour{formData.hours !== 1 ? 's' : ''} simulator session
          {formData.wantsCoach ? 
            ` with ${formData.coach ? formData.coach : 'selected'} coach for 1 hour` : 
            ' without a coach'
          }
        </p>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Change
        </button>
      </div>
      
      {sortedDates.length > 0 ? (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* All dates in chronological order */}
          {sortedDates.map(([date, sessions]) => {
            // Check if this date has any available sessions
            const hasAvailableSessions = sessions.some(session => session.isAvailable);
            
            return (
              <SessionCard
                key={date}
                date={date}
                sessions={sessions}
                onSelectSession={(session) => {
                  if (session.isAvailable) {
                    handleSessionSelection(session);
                    // Go straight to confirmation page when a session is selected
                    setStep(3);
                  }
                }}
                selectedSession={selectedSession || undefined}
                isAvailable={hasAvailableSessions}
              />
            );
          })}
        </div>
      ) : (
        <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 font-medium">
            No sessions found. Please try different options.
          </p>
        </div>
      )}
      
      {/* Bottom Refine button */}
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="py-3 px-6 bg-simstudio-yellow text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
        >
          BACK TO OPTIONS
        </button>
      </div>
    </div>
  );
};

export default BookingFormStep2;
