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
    return Object.entries(availableSessions)
      .sort(([dateA], [dateB]) => {
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      });
  }, [availableSessions]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Sessions</h2>
      
      {/* Top Refine button */}
      <div className="flex justify-between mb-4">
        <p className="text-gray-600">
          {formData.hours} hour{formData.hours !== 1 ? 's' : ''} simulator session
          {formData.wantsCoach ? 
            ` with ${formData.coach === 'any' ? 'any' : formData.coach} coach for ${formData.coachHours} hour${formData.coachHours !== 1 ? 's' : ''}` : 
            ' without a coach'
          }
        </p>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="py-1 px-3 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Refine
        </button>
      </div>
      
      {sortedDates.length > 0 ? (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
        <div className="mb-6 p-4 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-yellow-800">
            No sessions found. Please try different options.
          </p>
        </div>
      )}
      
      {/* Bottom Refine button */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Refine
        </button>
      </div>
    </div>
  );
};

export default BookingFormStep2;
