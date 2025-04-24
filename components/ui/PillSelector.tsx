import React from 'react';

interface PillSelectorProps {
  options: Array<{value: string | number | boolean, label: string}>;
  selectedValue: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  name: string;
}

const PillSelector = ({ 
  options, 
  selectedValue, 
  onChange, 
  name 
}: PillSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => (
        <button
          key={String(option.value)}
          type="button"
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedValue === option.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => onChange(option.value)}
          aria-pressed={selectedValue === option.value}
          name={name}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PillSelector;
