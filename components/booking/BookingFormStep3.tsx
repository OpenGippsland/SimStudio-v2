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
      <h2 className="text-2xl font-bold text-gray-800 mb-6 heading-font">Booking Confirmation</h2>
      
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
            </div>
          </div>
          
          {selectedUserCredits !== null && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <p className="text-gray-800 font-medium">
                Available Credits: {selectedUserCredits} hours
              </p>
              <p className="text-sm text-gray-600 mt-2">
                This booking will use {sessionDetails.hours} {sessionDetails.hours === 1 ? 'hour' : 'hours'}
              </p>
              {selectedUserCredits < sessionDetails.hours && (
                <p className="text-sm text-red-600 mt-2 font-medium">
                  Warning: Not enough credits for this booking!
                </p>
              )}
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <p className="font-bold">Booking created successfully!</p>
          <p className="mt-2">You will receive a confirmation email shortly.</p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="py-3 px-6 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        
        {!success && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`py-3 px-6 font-bold rounded-lg transition-colors ${
              isSubmitting
                ? 'bg-yellow-300 text-black cursor-not-allowed opacity-70'
                : 'bg-simstudio-yellow text-black hover:bg-yellow-500'
            }`}
          >
            {isSubmitting ? 'Processing...' : 
              !formData.userId ? 'PURCHASE AND CHECKOUT' : 
              (selectedUserCredits !== null && selectedUserCredits < formData.hours) ? 'PURCHASE CREDITS AND CHECKOUT' : 
              'CONFIRM BOOKING'
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingFormStep3;
