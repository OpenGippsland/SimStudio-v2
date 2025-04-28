import React from 'react';

interface UnavailableDateCardProps {
  date: string;
}

const UnavailableDateCard = ({ date }: UnavailableDateCardProps) => {
  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-4 rounded-lg shadow-md mb-4 border-l-4 bg-red-50 border-red-400">
      <h3 className="text-base font-semibold text-gray-800 mb-3">{formattedDate}</h3>
      <p className="text-sm text-red-600">Not available</p>
    </div>
  );
};

export default UnavailableDateCard;
