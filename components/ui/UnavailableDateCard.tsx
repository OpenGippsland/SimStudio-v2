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
    <div className="p-3 rounded-lg shadow-sm mb-3 border-l-4 bg-red-50 border-red-500">
      <h3 className="text-base font-semibold text-gray-800 mb-2">{formattedDate}</h3>
      <p className="text-xs text-red-600">Not available</p>
    </div>
  );
};

export default UnavailableDateCard;
