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
    <div className="flex flex-wrap items-center">
      {options.map((option, index) => (
        <React.Fragment key={String(option.value)}>
          {index > 0 && <span className="mx-1 text-gray-400">|</span>}
          <button
            type="button"
            className={`px-4 py-2 text-lg transition-colors border-b-2 ${
              selectedValue === option.value
                ? 'text-black font-bold border-simstudio-yellow'
                : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
            }`}
            onClick={() => onChange(option.value)}
            aria-pressed={selectedValue === option.value}
            name={name}
          >
            {option.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default PillSelector;
