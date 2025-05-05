import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PillSelector from '../components/ui/PillSelector';
import SessionCard from '../components/ui/SessionCard';
import UnavailableDateCard from '../components/ui/UnavailableDateCard';
import Link from 'next/link';
import { Session } from '../lib/booking/types';

const StyleGuide = () => {
  // State for interactive components
  const [selectedPillValue, setSelectedPillValue] = useState('option1');
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined);
  
  // Sample data for components
  const pillOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
  
  const sampleSessions: Session[] = [
    {
      startTime: '2023-05-01T09:00:00',
      endTime: '2023-05-01T10:00:00',
      formattedTime: '9:00 AM - 10:00 AM',
      isAvailable: true,
    },
    {
      startTime: '2023-05-01T10:30:00',
      endTime: '2023-05-01T11:30:00',
      formattedTime: '10:30 AM - 11:30 AM',
      isAvailable: true,
    },
    {
      startTime: '2023-05-01T13:00:00',
      endTime: '2023-05-01T14:00:00',
      formattedTime: '1:00 PM - 2:00 PM',
      isAvailable: false,
      unavailableReason: 'Booked',
    },
  ];
  
  const unavailableSessions: Session[] = [
    {
      startTime: '2023-05-02T09:00:00',
      endTime: '2023-05-02T10:00:00',
      formattedTime: 'Not Available',
      isAvailable: false,
      unavailableReason: 'Closed',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 heading-font">SimStudio Style Guide</h1>
        
        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            <li>
              <a href="#colors" className="text-blue-600 hover:underline">Colors</a>
            </li>
            <li>
              <a href="#typography" className="text-blue-600 hover:underline">Typography</a>
            </li>
            <li>
              <a href="#buttons" className="text-blue-600 hover:underline">Buttons</a>
            </li>
            <li>
              <a href="#forms" className="text-blue-600 hover:underline">Form Elements</a>
            </li>
            <li>
              <a href="#cards" className="text-blue-600 hover:underline">Cards</a>
            </li>
            <li>
              <a href="#components" className="text-blue-600 hover:underline">UI Components</a>
            </li>
            <li>
              <a href="#new-elements" className="text-blue-600 hover:underline">New Design Elements</a>
            </li>
          </ul>
        </div>
        
        {/* Colors Section */}
        <section id="colors" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Colors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primary Colors */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Primary</h3>
              <div className="space-y-2">
                <div className="h-24 bg-simstudio-yellow rounded-md flex items-end p-2">
                  <span className="text-black font-medium">simstudio-yellow (#FFC20E)</span>
                </div>
                <div className="h-24 bg-simstudio-black rounded-md flex items-end p-2">
                  <span className="text-white font-medium">simstudio-black (#000000)</span>
                </div>
              </div>
            </div>
            
            {/* Grays */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Grays</h3>
              <div className="space-y-2">
                <div className="h-12 bg-gray-100 rounded-md flex items-center p-2">
                  <span className="text-gray-800 font-medium">gray-100</span>
                </div>
                <div className="h-12 bg-gray-200 rounded-md flex items-center p-2">
                  <span className="text-gray-800 font-medium">gray-200</span>
                </div>
                <div className="h-12 bg-gray-300 rounded-md flex items-center p-2">
                  <span className="text-gray-800 font-medium">gray-300</span>
                </div>
                <div className="h-12 bg-gray-400 rounded-md flex items-center p-2">
                  <span className="text-gray-800 font-medium">gray-400</span>
                </div>
                <div className="h-12 bg-gray-500 rounded-md flex items-center p-2">
                  <span className="text-white font-medium">gray-500</span>
                </div>
                <div className="h-12 bg-gray-600 rounded-md flex items-center p-2">
                  <span className="text-white font-medium">gray-600</span>
                </div>
                <div className="h-12 bg-gray-700 rounded-md flex items-center p-2">
                  <span className="text-white font-medium">gray-700</span>
                </div>
                <div className="h-12 bg-gray-800 rounded-md flex items-center p-2">
                  <span className="text-white font-medium">gray-800</span>
                </div>
              </div>
            </div>
            
            {/* Status Colors */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Status</h3>
              <div className="space-y-2">
                <div className="h-12 bg-green-500 rounded-md flex items-center p-2">
                  <span className="text-white font-medium">Success (green-500)</span>
                </div>
                <div className="h-12 bg-red-500 rounded-md flex items-center p-2">
                  <span className="text-white font-medium">Error (red-500)</span>
                </div>
                <div className="h-12 bg-yellow-400 rounded-md flex items-center p-2">
                  <span className="text-black font-medium">Warning (yellow-400)</span>
                </div>
                <div className="h-12 bg-blue-500 rounded-md flex items-center p-2">
                  <span className="text-white font-medium">Info (blue-500)</span>
                </div>
              </div>
            </div>
            
            {/* Background Colors */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Backgrounds</h3>
              <div className="space-y-2">
                <div className="h-12 bg-white border border-gray-200 rounded-md flex items-center p-2">
                  <span className="text-gray-800 font-medium">White</span>
                </div>
                <div className="h-12 bg-gray-50 rounded-md flex items-center p-2">
                  <span className="text-gray-800 font-medium">Light Gray (gray-50)</span>
                </div>
                <div className="h-12 bg-red-50 rounded-md flex items-center p-2">
                  <span className="text-red-800 font-medium">Light Red (red-50)</span>
                </div>
                <div className="h-24 carbon-bg rounded-md flex items-end p-2">
                  <span className="text-white font-medium">Carbon Background</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Typography Section */}
        <section id="typography" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Typography</h2>
          
          <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-medium mb-4">Font Families</h3>
            <div className="space-y-4">
              <div>
                <p className="heading-font text-2xl">Spantaran</p>
                <p className="text-gray-500 mt-1">Primary heading font - Used for main headings with the <code>heading-font</code> class</p>
              </div>
              <div>
                <p className="text-2xl">Inter</p>
                <p className="text-gray-500 mt-1">Primary body font - Default font for all body text</p>
              </div>
              <div>
                <p className="font-sans text-2xl">System Sans-Serif</p>
                <p className="text-gray-500 mt-1">Fallback fonts: Helvetica, Arial, sans-serif</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Headings</h3>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-5xl font-bold heading-font">Heading 1 (Spantaran)</h1>
                  <p className="text-gray-500 mt-1">text-5xl font-bold heading-font</p>
                </div>
                
                <div>
                  <h2 className="text-4xl font-bold">Heading 2</h2>
                  <p className="text-gray-500 mt-1">text-4xl font-bold</p>
                </div>
                
                <div>
                  <h3 className="text-3xl font-semibold">Heading 3</h3>
                  <p className="text-gray-500 mt-1">text-3xl font-semibold</p>
                </div>
                
                <div>
                  <h4 className="text-2xl font-semibold">Heading 4</h4>
                  <p className="text-gray-500 mt-1">text-2xl font-semibold</p>
                </div>
                
                <div>
                  <h5 className="text-xl font-medium">Heading 5</h5>
                  <p className="text-gray-500 mt-1">text-xl font-medium</p>
                </div>
                
                <div>
                  <h6 className="text-lg font-medium">Heading 6</h6>
                  <p className="text-gray-500 mt-1">text-lg font-medium</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Text Styles</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-base">Base paragraph text. This is the default text style used throughout the application.</p>
                  <p className="text-gray-500 mt-1">text-base</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Small text, often used for secondary information.</p>
                  <p className="text-gray-500 mt-1">text-sm text-gray-600</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Extra small text, used for captions or fine print.</p>
                  <p className="text-gray-500 mt-1">text-xs text-gray-500</p>
                </div>
                
                <div>
                  <p className="text-lg font-medium">Large text, used for emphasis or introductions.</p>
                  <p className="text-gray-500 mt-1">text-lg font-medium</p>
                </div>
                
                <div>
                  <p className="italic">Italic text for emphasis.</p>
                  <p className="text-gray-500 mt-1">italic</p>
                </div>
                
                <div>
                  <p className="font-bold">Bold text for strong emphasis.</p>
                  <p className="text-gray-500 mt-1">font-bold</p>
                </div>
                
                <div>
                  <p className="underline">Underlined text.</p>
                  <p className="text-gray-500 mt-1">underline</p>
                </div>
                
                <div>
                  <p className="line-through">Strikethrough text.</p>
                  <p className="text-gray-500 mt-1">line-through</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Buttons Section */}
        <section id="buttons" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Buttons</h2>
          
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-4">Button Styles Overview</h3>
            <div className="flex flex-wrap gap-4">
              <button className="border-2 border-simstudio-yellow bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-simstudio-yellow hover:text-black transition-colors">
                Primary
              </button>
              <button className="bg-simstudio-yellow text-black font-medium py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
                Solid
              </button>
              <button className="bg-gray-800 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                Secondary
              </button>
              <button className="border border-gray-300 bg-white text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                Outline
              </button>
              <button className="bg-gradient-to-r from-simstudio-yellow to-yellow-500 text-black font-medium py-2 px-4 rounded-md hover:from-yellow-500 hover:to-simstudio-yellow transition-colors">
                Gradient
              </button>
              <button className="bg-white text-gray-800 font-medium py-2 px-4 rounded-full border-2 border-simstudio-yellow hover:bg-simstudio-yellow hover:text-black transition-colors">
                Pill
              </button>
              <button className="flex items-center space-x-2 bg-simstudio-yellow text-black font-medium py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                <span>With Icon</span>
              </button>
              <button className="relative overflow-hidden bg-simstudio-yellow text-black font-medium py-2 px-4 rounded-md group">
                <span className="relative z-10 group-hover:text-white transition-colors">Hover Effect</span>
                <span className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Primary Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="border-2 border-simstudio-yellow bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-simstudio-yellow hover:text-black transition-colors">
                    Primary Button
                  </button>
                  <p className="text-gray-500 mt-2">border-2 border-simstudio-yellow hover:bg-simstudio-yellow</p>
                </div>
                
                <div>
                  <button className="border-2 border-simstudio-yellow bg-white text-black font-medium py-2 px-4 rounded-md opacity-50 cursor-not-allowed">
                    Disabled Primary
                  </button>
                  <p className="text-gray-500 mt-2">opacity-50 cursor-not-allowed</p>
                </div>
                
                <div>
                  <button className="border-2 border-simstudio-yellow bg-white text-black font-medium py-3 px-6 rounded-md hover:bg-simstudio-yellow hover:text-black transition-colors text-lg">
                    Large Primary
                  </button>
                  <p className="text-gray-500 mt-2">py-3 px-6 text-lg</p>
                </div>
                
                <div>
                  <button className="border-2 border-simstudio-yellow bg-white text-black font-medium py-1 px-3 rounded-md hover:bg-simstudio-yellow hover:text-black transition-colors text-sm">
                    Small Primary
                  </button>
                  <p className="text-gray-500 mt-2">py-1 px-3 text-sm</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Secondary Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="bg-gray-800 text-white font-medium py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                    Secondary Button
                  </button>
                  <p className="text-gray-500 mt-2">bg-gray-800 text-white</p>
                </div>
                
                <div>
                  <button className="bg-gray-800 text-white font-medium py-2 px-4 rounded-md opacity-50 cursor-not-allowed">
                    Disabled Secondary
                  </button>
                  <p className="text-gray-500 mt-2">opacity-50 cursor-not-allowed</p>
                </div>
                
                <div>
                  <button className="bg-gray-800 text-white font-medium py-3 px-6 rounded-md hover:bg-gray-700 transition-colors text-lg">
                    Large Secondary
                  </button>
                  <p className="text-gray-500 mt-2">py-3 px-6 text-lg</p>
                </div>
                
                <div>
                  <button className="bg-gray-800 text-white font-medium py-1 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm">
                    Small Secondary
                  </button>
                  <p className="text-gray-500 mt-2">py-1 px-3 text-sm</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Outline Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="border border-gray-300 bg-white text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                    Outline Button
                  </button>
                  <p className="text-gray-500 mt-2">border border-gray-300 bg-white</p>
                </div>
                
                <div>
                  <button className="border border-simstudio-yellow bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-simstudio-yellow/10 transition-colors">
                    Yellow Outline
                  </button>
                  <p className="text-gray-500 mt-2">border border-simstudio-yellow hover:bg-simstudio-yellow/10</p>
                </div>
                
                <div>
                  <button className="border border-gray-800 bg-white text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-800 hover:text-white transition-colors">
                    Dark Outline
                  </button>
                  <p className="text-gray-500 mt-2">border border-gray-800 hover:bg-gray-800 hover:text-white</p>
                </div>
                
                <div>
                  <button className="border-2 border-dashed border-simstudio-yellow bg-white text-black font-medium py-2 px-4 rounded-md hover:border-solid hover:bg-simstudio-yellow/10 transition-all">
                    Dashed Border
                  </button>
                  <p className="text-gray-500 mt-2">border-2 border-dashed border-simstudio-yellow</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Text & Link Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="text-simstudio-yellow hover:text-yellow-600 font-medium transition-colors">
                    Text Button
                  </button>
                  <p className="text-gray-500 mt-2">text-simstudio-yellow hover:text-yellow-600</p>
                </div>
                
                <div>
                  <button className="text-gray-800 hover:text-simstudio-yellow font-medium transition-colors underline">
                    Underlined Link
                  </button>
                  <p className="text-gray-500 mt-2">text-gray-800 hover:text-simstudio-yellow underline</p>
                </div>
                
                <div>
                  <button className="text-gray-800 hover:text-simstudio-yellow font-medium transition-colors">
                    <span className="border-b-2 border-transparent hover:border-simstudio-yellow pb-1 transition-colors">
                      Hover Underline
                    </span>
                  </button>
                  <p className="text-gray-500 mt-2">border-b-2 border-transparent hover:border-simstudio-yellow</p>
                </div>
                
                <div>
                  <button className="text-gray-800 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    <span>View More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <p className="text-gray-500 mt-2">flex items-center gap-1 hover:gap-2 transition-all</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Status Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 transition-colors">
                    Danger Button
                  </button>
                  <p className="text-gray-500 mt-2">bg-red-500 text-white</p>
                </div>
                
                <div>
                  <button className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                    Success Button
                  </button>
                  <p className="text-gray-500 mt-2">bg-green-500 text-white</p>
                </div>
                
                <div>
                  <button className="border-2 border-red-500 text-red-500 font-medium py-2 px-4 rounded-md hover:bg-red-50 transition-colors">
                    Danger Outline
                  </button>
                  <p className="text-gray-500 mt-2">border-2 border-red-500 text-red-500 hover:bg-red-50</p>
                </div>
                
                <div>
                  <button className="border-2 border-green-500 text-green-500 font-medium py-2 px-4 rounded-md hover:bg-green-50 transition-colors">
                    Success Outline
                  </button>
                  <p className="text-gray-500 mt-2">border-2 border-green-500 text-green-500 hover:bg-green-50</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Special Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="bg-white text-gray-800 font-medium py-2 px-4 rounded-full border-2 border-simstudio-yellow hover:bg-simstudio-yellow hover:text-black transition-colors">
                    Pill Button
                  </button>
                  <p className="text-gray-500 mt-2">rounded-full border-2 border-simstudio-yellow</p>
                </div>
                
                <div>
                  <button className="bg-white text-gray-800 font-medium py-2 px-4 rounded-md border-2 border-simstudio-yellow shadow-lg shadow-simstudio-yellow/30 hover:shadow-simstudio-yellow/50 transition-shadow">
                    Shadow Button
                  </button>
                  <p className="text-gray-500 mt-2">shadow-lg shadow-simstudio-yellow/30</p>
                </div>
                
                <div>
                  <button className="bg-white text-gray-800 font-medium py-2 px-4 rounded-md border-2 border-simstudio-yellow hover:scale-105 transition-transform">
                    Scale Button
                  </button>
                  <p className="text-gray-500 mt-2">hover:scale-105 transition-transform</p>
                </div>
                
                <div className="relative">
                  <button className="bg-white text-gray-800 font-medium py-2 px-4 rounded-md border-2 border-simstudio-yellow group">
                    <span className="group-hover:opacity-0 transition-opacity">Swap Text</span>
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">Click Me!</span>
                  </button>
                  <p className="text-gray-500 mt-2">group-hover with absolute positioning</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Form Elements Section */}
        <section id="forms" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Form Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-medium">Text Inputs</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="standard-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Standard Input
                  </label>
                  <input
                    type="text"
                    id="standard-input"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-simstudio-yellow focus:border-transparent"
                    placeholder="Enter text here"
                  />
                  <p className="text-gray-500 mt-1 text-xs">border focus:ring-2 focus:ring-simstudio-yellow</p>
                </div>
                
                <div>
                  <label htmlFor="disabled-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Disabled Input
                  </label>
                  <input
                    type="text"
                    id="disabled-input"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder="Disabled input"
                    disabled
                  />
                  <p className="text-gray-500 mt-1 text-xs">bg-gray-100 cursor-not-allowed disabled</p>
                </div>
                
                <div>
                  <label htmlFor="error-input" className="block text-sm font-medium text-red-600 mb-1">
                    Error Input
                  </label>
                  <input
                    type="text"
                    id="error-input"
                    className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Error input"
                  />
                  <p className="text-red-500 mt-1 text-xs">This field is required</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="textarea" className="block text-sm font-medium text-gray-700 mb-1">
                  Textarea
                </label>
                <textarea
                  id="textarea"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-simstudio-yellow focus:border-transparent"
                  placeholder="Enter longer text here"
                ></textarea>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-medium">Selection Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Checkbox
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="checkbox-1"
                        className="h-4 w-4 text-simstudio-yellow focus:ring-simstudio-yellow border-gray-300 rounded"
                      />
                      <label htmlFor="checkbox-1" className="ml-2 block text-sm text-gray-700">
                        Option 1
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="checkbox-2"
                        className="h-4 w-4 text-simstudio-yellow focus:ring-simstudio-yellow border-gray-300 rounded"
                        checked
                      />
                      <label htmlFor="checkbox-2" className="ml-2 block text-sm text-gray-700">
                        Option 2 (checked)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="checkbox-3"
                        className="h-4 w-4 text-gray-400 focus:ring-gray-400 border-gray-300 rounded cursor-not-allowed"
                        disabled
                      />
                      <label htmlFor="checkbox-3" className="ml-2 block text-sm text-gray-500">
                        Option 3 (disabled)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Radio Buttons
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="radio-1"
                        name="radio-group"
                        className="h-4 w-4 text-simstudio-yellow focus:ring-simstudio-yellow border-gray-300"
                      />
                      <label htmlFor="radio-1" className="ml-2 block text-sm text-gray-700">
                        Option 1
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="radio-2"
                        name="radio-group"
                        className="h-4 w-4 text-simstudio-yellow focus:ring-simstudio-yellow border-gray-300"
                        checked
                      />
                      <label htmlFor="radio-2" className="ml-2 block text-sm text-gray-700">
                        Option 2 (selected)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="radio-3"
                        name="radio-group"
                        className="h-4 w-4 text-gray-400 focus:ring-gray-400 border-gray-300 cursor-not-allowed"
                        disabled
                      />
                      <label htmlFor="radio-3" className="ml-2 block text-sm text-gray-500">
                        Option 3 (disabled)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Dropdown
                  </label>
                  <select
                    id="select"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-simstudio-yellow focus:border-transparent bg-white"
                  >
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toggle Switch
                  </label>
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" id="toggle" className="sr-only" />
                      <div className="block bg-gray-300 w-10 h-6 rounded-full"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                    </div>
                    <label htmlFor="toggle" className="text-sm text-gray-700">
                      Toggle option
                    </label>
                  </div>
                  <style jsx>{`
                    #toggle:checked ~ .dot {
                      transform: translateX(100%);
                      background-color: #FFC20E;
                    }
                    #toggle:checked ~ .block {
                      background-color: #FFC20E;
                    }
                  `}</style>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Cards Section */}
        <section id="cards" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Basic Card</h3>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold mb-2">Card Title</h4>
                <p className="text-gray-600 mb-4">This is a basic card with some content. Cards are used to group related information.</p>
                <button className="bg-simstudio-yellow text-black font-medium py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">
                  Card Action
                </button>
              </div>
              <p className="text-gray-500 mt-2">bg-white rounded-lg shadow-md p-6</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Session Card</h3>
              <SessionCard 
                date="2023-05-01" 
                sessions={sampleSessions} 
                onSelectSession={setSelectedSession}
                selectedSession={selectedSession}
                isAvailable={true}
              />
              <p className="text-gray-500 mt-2">Existing SessionCard component</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Unavailable Date Card</h3>
              <UnavailableDateCard date="2023-05-02" />
              <p className="text-gray-500 mt-2">Existing UnavailableDateCard component</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Bordered Card</h3>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Bordered Card</h4>
                <p className="text-gray-600">A card with a subtle border for a softer appearance.</p>
              </div>
              <p className="text-gray-500 mt-2">border border-gray-200</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Accent Card</h3>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-simstudio-yellow">
                <h4 className="text-lg font-semibold mb-2">Accent Card</h4>
                <p className="text-gray-600">A card with a colored accent on the left side.</p>
              </div>
              <p className="text-gray-500 mt-2">border-l-4 border-simstudio-yellow</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Hover Card</h3>
              <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                <h4 className="text-lg font-semibold mb-2">Hover Card</h4>
                <p className="text-gray-600">This card has a hover effect. Try hovering over it!</p>
              </div>
              <p className="text-gray-500 mt-2">hover:shadow-lg hover:-translate-y-1</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Booking Card</h3>
              <div 
                className="relative bg-white overflow-hidden transform transition-all duration-200 border-2 border-simstudio-yellow"
                style={{
                  borderTopLeftRadius: '38px',
                  borderBottomRightRadius: '38px'
                }}
              >
                {/* Card Header with Simulator ID and Duration */}
                <div className="relative p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">
                        Simulator 1
                      </div>
                      <div className="text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Booking #123
                      </div>
                    </div>
                    <div className="text-gray-700 px-3 py-1.5 text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2 hours
                    </div>
                  </div>
                </div>
                
                {/* Card Body with Date and Status */}
                <div className="p-5 bg-white">
                  <div className="mb-4 text-gray-700 p-3">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Mon, May 5, 2025, 10:00 AM</span>
                    </div>
                    <div>
                      <a 
                        href="#"
                        className="flex items-center text-gray-600 hover:text-gray-800 text-xs font-medium"
                      >
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add to calendar
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Booking confirmed
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center text-gray-700 text-xs px-3 py-1.5">
                      <svg className="w-3.5 h-3.5 mr-1 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Coach: John Smith
                    </span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="px-5 py-4 border-t border-gray-200">
                  <button
                    className="w-full text-sm py-2 px-4 transition-all flex items-center justify-center text-red-600 hover:text-red-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Cancel Booking
                  </button>
                </div>
              </div>
              <p className="text-gray-500 mt-2">border-2 border-simstudio-yellow with custom border radius</p>
            </div>
          </div>
        </section>
        
        {/* UI Components Section */}
        <section id="components" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">UI Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Pill Selector</h3>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <PillSelector
                  options={pillOptions}
                  selectedValue={selectedPillValue}
                  onChange={(value) => setSelectedPillValue(value as string)}
                  name="pill-selector-example"
                />
                <p className="text-gray-500 mt-4">Existing PillSelector component</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Navigation Links</h3>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-wrap gap-2">
                  <Link href="#" className="px-3 py-2 rounded-md bg-simstudio-yellow text-black font-medium">
                    Active Link
                  </Link>
                  <Link href="#" className="px-3 py-2 rounded-md hover:text-simstudio-yellow">
                    Inactive Link
                  </Link>
                  <Link href="#" className="px-3 py-2 rounded-md hover:text-simstudio-yellow">
                    Another Link
                  </Link>
                </div>
                <p className="text-gray-500 mt-4">Navigation link styles</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* New Design Elements Section */}
        <section id="new-elements" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">New Design Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Badge Component */}
            <div>
              <h3 className="text-xl font-medium mb-4">Badges</h3>
              <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-simstudio-yellow text-black">
                    Primary
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Default
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Success
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Error
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Info
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-simstudio-yellow text-black">
                    Primary
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                    Default
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                    Success
                  </span>
                </div>
              </div>
            </div>
            
            {/* Alert Component */}
            <div>
              <h3 className="text-xl font-medium mb-4">Alerts</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-simstudio-yellow bg-opacity-20 border border-simstudio-yellow">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Information Alert</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>This is an information alert with the primary color.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-green-50 border border-green-400">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Success Alert</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>This is a success alert for successful operations.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-md bg-red-50 border border-red-400">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Alert</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>This is an error alert for error messages.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tooltip Component */}
            <div>
              <h3 className="text-xl font-medium mb-4">Tooltips</h3>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative group">
                    <button className="bg-simstudio-yellow text-black font-medium py-2 px-4 rounded-md">
                      Hover Me
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      This is a tooltip
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <button className="bg-gray-800 text-white font-medium py-2 px-4 rounded-md">
                      Another Tooltip
                    </button>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Bottom tooltip
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar Component */}
            <div>
              <h3 className="text-xl font-medium mb-4">Progress Bars</h3>
              <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Basic Progress (25%)</span>
                    <span className="text-sm font-medium text-gray-700">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-simstudio-yellow h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress (50%)</span>
                    <span className="text-sm font-medium text-gray-700">50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-simstudio-yellow h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress (75%)</span>
                    <span className="text-sm font-medium text-gray-700">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-simstudio-yellow h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress (100%)</span>
                    <span className="text-sm font-medium text-gray-700">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs Component */}
            <div>
              <h3 className="text-xl font-medium mb-4">Tabs</h3>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <a href="#" className="border-simstudio-yellow text-gray-900 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Tab 1
                    </a>
                    <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Tab 2
                    </a>
                    <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Tab 3
                    </a>
                  </nav>
                </div>
                <div className="py-4">
                  <p className="text-gray-700">Tab 1 content would go here.</p>
                </div>
              </div>
            </div>
            
            {/* Pagination Component */}
            <div>
              <h3 className="text-xl font-medium mb-4">Pagination</h3>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <nav className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </a>
                    <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Next
                    </a>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          1
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-simstudio-yellow text-sm font-medium text-black">
                          2
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          3
                        </a>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          8
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          9
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          10
                        </a>
                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </nav>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default StyleGuide;
