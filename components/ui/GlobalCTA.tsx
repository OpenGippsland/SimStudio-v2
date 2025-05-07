import React from 'react';
import Link from 'next/link';

interface GlobalCTAProps {
  title?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const GlobalCTA: React.FC<GlobalCTAProps> = ({
  title = "Ready to experience SimStudio?",
  primaryButtonText = "BOOK A SESSION",
  primaryButtonLink = "/booking",
  secondaryButtonText = "CONTACT US",
  secondaryButtonLink = "/contact"
}) => {
  return (
    <div className="bg-gray-50 py-12 px-4 rounded-xl shadow-md border border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link 
            href={primaryButtonLink} 
            className="bg-simstudio-yellow hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-lg transition duration-300 text-lg shadow-md"
          >
            {primaryButtonText}
          </Link>
          <Link 
            href={secondaryButtonLink} 
            className="border-2 border-gray-800 hover:bg-gray-800 hover:text-white text-black font-bold py-4 px-10 rounded-lg transition duration-300 text-lg"
          >
            {secondaryButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlobalCTA;
