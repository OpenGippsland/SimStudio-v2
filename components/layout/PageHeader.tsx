import React, { ReactNode } from 'react';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  useCarbonBg?: boolean;
  bgImage?: string;
  bgImageOpacity?: number;
  buttons?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  useCarbonBg = false,
  bgImage,
  bgImageOpacity = 50,
  buttons
}) => {
  return (
    <div className={`${useCarbonBg ? 'carbon-bg text-white' : 'bg-white text-gray-800'} py-12 relative overflow-hidden`}>
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={bgImage} 
            alt="Background" 
            fill
            className="object-cover"
            style={{ opacity: bgImageOpacity / 100 }}
          />
        </div>
      )}
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl max-w-3xl mx-auto mb-4">
            {subtitle}
          </p>
        )}
        {buttons && (
          <div className="mt-6">
            {buttons}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
