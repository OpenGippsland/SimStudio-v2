import React from 'react';
import { Session } from '../../lib/booking/types';

interface SessionCardProps {
  date: string;
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  selectedSession?: Session;
  isAvailable?: boolean;
}

const SessionCard = ({ 
  date, 
  sessions, 
  onSelectSession, 
  selectedSession,
  isAvailable = true
}: SessionCardProps) => {
  // Format date for display (e.g., "Monday, May 2")
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`p-4 rounded-lg shadow-md mb-4 border-l-4 ${
      isAvailable 
        ? 'bg-white border-simstudio-yellow' 
        : 'bg-red-50 border-red-400'
    }`}>
      <h3 className="text-base font-semibold text-gray-800 mb-3">{formattedDate}</h3>
      
      {sessions.length > 0 ? (
        <div>
          <p className="text-sm text-gray-600 mb-2">Sessions:</p>
          <div className="grid grid-cols-2 gap-2 w-full">
            {sessions.map((session, index) => {
              // Skip placeholder sessions for closed dates
              if (session.formattedTime === "Not Available") {
                return (
                  <div 
                    key={index}
                    className="px-3 py-2 rounded-lg text-xs w-full bg-red-50 text-red-700 flex items-center justify-center"
                    title={session.unavailableReason}
                  >
                    {session.unavailableReason || "Not available"}
                  </div>
                );
              }
              
              return (
                <button
                  key={index}
                  type="button"
                  className={`px-3 py-2 rounded-lg text-xs transition-colors w-full ${
                    selectedSession?.startTime === session.startTime
                      ? 'bg-simstudio-yellow text-black font-medium'
                      : session.isAvailable
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-red-50 text-red-700 cursor-not-allowed'
                  }`}
                  onClick={() => session.isAvailable && onSelectSession(session)}
                  title={session.isAvailable ? undefined : session.unavailableReason}
                  disabled={!session.isAvailable}
                >
                  {session.formattedTime}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No sessions available</p>
      )}
    </div>
  );
};

export default SessionCard;
