import React from 'react';
import { FormData, Session, SessionDetails } from '../../lib/booking/types';

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
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Confirmation</h2>
      
      {sessionDetails && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Date:</span> {sessionDetails.date}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Time:</span> {sessionDetails.time}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium">Simulator:</span> {sessionDetails.hours} hour{sessionDetails.hours !== 1 ? 's' : ''}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-medium">Coach:</span> {sessionDetails.coach === 'None' ? 'None' : (
              <>
                {sessionDetails.coach} for {sessionDetails.coachHours} hour{sessionDetails.coachHours !== 1 ? 's' : ''}
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
          
          {selectedUserCredits !== null && (
            <div className="p-3 bg-blue-50 rounded border border-blue-200 mb-4">
              <p className="text-blue-800 font-medium">
                Available Credits: {selectedUserCredits} hours
              </p>
              <p className="text-sm text-blue-600 mt-1">
                This booking will use {sessionDetails.hours} {sessionDetails.hours === 1 ? 'hour' : 'hours'}
              </p>
              {selectedUserCredits < sessionDetails.hours && (
                <p className="text-sm text-red-600 mt-1 font-medium">
                  Warning: Not enough credits for this booking!
                </p>
              )}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Booking created successfully!
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="py-2 px-4 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Refine
        </button>
        
        {!success && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`py-2 px-4 font-medium rounded-lg transition-colors ${
              isSubmitting
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Processing...' : 
              !formData.userId ? 'Purchase and Checkout' : 
              (selectedUserCredits !== null && selectedUserCredits < formData.hours) ? 'Purchase Credits and Checkout' : 
              'Confirm Booking'
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingFormStep3;
