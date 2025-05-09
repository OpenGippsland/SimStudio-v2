import React, { useState, useEffect } from 'react';

interface HourlyRateManagerProps {
  isAdmin: boolean;
}

const HourlyRateManager: React.FC<HourlyRateManagerProps> = ({ isAdmin }) => {
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [newRate, setNewRate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Fetch the current hourly rate
  useEffect(() => {
    const fetchHourlyRate = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hourly-rate');
        if (!response.ok) {
          throw new Error('Failed to fetch hourly rate');
        }
        const data = await response.json();
        setHourlyRate(parseFloat(data.price));
        setNewRate(data.price.toString());
      } catch (error) {
        console.error('Error fetching hourly rate:', error);
        setError('Failed to load hourly rate. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyRate();
  }, []);

  // Handle updating the hourly rate
  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const rateValue = parseFloat(newRate);
    if (isNaN(rateValue) || rateValue <= 0) {
      setError('Please enter a valid hourly rate (must be greater than 0)');
      return;
    }

    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/hourly-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: rateValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update hourly rate');
      }

      const data = await response.json();
      setHourlyRate(parseFloat(data.price));
      setSuccess('Hourly rate updated successfully!');
    } catch (error: any) {
      console.error('Error updating hourly rate:', error);
      setError(error.message || 'An error occurred while updating the hourly rate');
    } finally {
      setUpdating(false);
    }
  };

  // If not admin, don't render the component
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Hourly Rate Management</h2>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-simstudio-yellow"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-700">
              Current hourly rate: <span className="font-bold">${hourlyRate?.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              This rate is used for all hourly bookings that don't use package credits.
            </p>
          </div>

          <form onSubmit={handleUpdateRate} className="mt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                  New Hourly Rate ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="hourlyRate"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    min="0"
                    step="0.01"
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-simstudio-yellow focus:border-simstudio-yellow"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={updating}
                  className={`w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm font-medium text-white ${
                    updating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-simstudio-yellow hover:bg-yellow-500 text-black'
                  }`}
                >
                  {updating ? 'Updating...' : 'Update Rate'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
              {success}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HourlyRateManager;
