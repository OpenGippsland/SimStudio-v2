import React, { useState } from 'react';
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
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">SimStudio Style Guide</h1>
        
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
              <a href="#messaging" className="text-blue-600 hover:underline">Messaging</a>
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
          </div>
        </section>
        
        {/* Typography Section */}
        <section id="typography" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Typography</h2>
          
          <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-medium mb-4">Font Families</h3>
            <div className="space-y-4">
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
                  <h1 className="text-5xl font-bold">Heading 1</h1>
                  <p className="text-gray-500 mt-1">text-5xl font-bold</p>
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
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          
            
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Outline Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="border-2 border-gray-300 bg-white text-black tracking-wide py-3 px-5 rounded-lg hover:bg-gray-50 transition-all">
                    Outline Button
                  </button>
                  <p className="text-gray-500 mt-2">border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all</p>
                </div>
                
                <div>
                  <button className="border-2 border-simstudio-yellow bg-white text-black tracking-wide py-3 px-5 rounded-lg hover:bg-yellow-50 transition-all">
                    Yellow Outline
                  </button>
                  <p className="text-gray-500 mt-2">border-2 border-simstudio-yellow rounded-lg hover:bg-yellow-50 transition-all</p>
                </div>
                
                <div>
                  <button className="border-2 border-black bg-white text-black tracking-wide py-3 px-5 rounded-lg hover:bg-gray-50 transition-all">
                    Black Outline
                  </button>
                  <p className="text-gray-500 mt-2">border-2 border-black rounded-lg hover:bg-gray-50 transition-all</p>
                </div>
                
                <div>
                  <a href="#" className="flex items-center justify-between w-full py-3 px-5 border-2 border-gray-300 text-black tracking-wide rounded-lg hover:bg-gray-50 transition-all group">
                    <span>Gray Outline with Arrow</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </a>
                  <p className="text-gray-500 mt-2">border-2 border-gray-300 rounded-lg hover:bg-gray-50 group-hover:translate-x-1</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <a href="/booking" className="flex items-center justify-between w-full py-3 px-5 border-2 border-simstudio-yellow text-black tracking-wide rounded-lg hover:bg-yellow-50 transition-all group">
                      <span>Yellow Outline with Arrow</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                    <p className="text-gray-500 mt-2">border-2 border-simstudio-yellow rounded-lg hover:bg-yellow-50 group-hover:translate-x-1</p>
                  </div>
                  
                  <div>
                    <a href="/my-account" className="flex items-center justify-between w-full py-3 px-5 border-2 border-gray-800 text-black tracking-wide rounded-lg hover:bg-gray-50 transition-all group">
                      <span>Black Outline with Arrow</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                    <p className="text-gray-500 mt-2">border-2 border-gray-800 rounded-lg hover:bg-gray-50 group-hover:translate-x-1</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Inverted Hover Buttons</h3>
              
              <div className="space-y-4">
                <div>
                  <button className="border-2 border-gray-300 bg-gray-50 text-black tracking-wide py-3 px-5 rounded-lg hover:bg-white hover:text-black transition-all">
                    Outline Button
                  </button>
                  <p className="text-gray-500 mt-2">bg-gray-50 hover:bg-white transition-all</p>
                </div>
                
                <div>
                  <button className="border-2 border-simstudio-yellow bg-yellow-50 text-black tracking-wide py-3 px-5 rounded-lg hover:bg-white hover:text-black transition-all">
                    Yellow Outline
                  </button>
                  <p className="text-gray-500 mt-2">bg-yellow-50 hover:bg-white transition-all</p>
                </div>
                
                <div>
                  <button className="border-2 border-black bg-gray-100 text-black tracking-wide py-3 px-5 rounded-lg hover:bg-white hover:text-black transition-all">
                    Black Outline
                  </button>
                  <p className="text-gray-500 mt-2">bg-gray-100 hover:bg-white hover:text-black transition-all</p>
                </div>
                
                <div>
                  <a href="#" className="flex items-center justify-between w-full py-3 px-5 border-2 border-gray-300 bg-gray-50 text-black tracking-wide rounded-lg hover:bg-white transition-all group">
                    <span>Gray with Arrow</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </a>
                  <p className="text-gray-500 mt-2">bg-gray-50 hover:bg-white group-hover:translate-x-1</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <a href="/booking" className="flex items-center justify-between w-full py-3 px-5 border-2 border-simstudio-yellow bg-yellow-50 text-black tracking-wide rounded-lg hover:bg-white transition-all group">
                      <span>Yellow with Arrow</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                    <p className="text-gray-500 mt-2">bg-yellow-50 hover:bg-white group-hover:translate-x-1</p>
                  </div>
                  
                  <div>
                    <a href="/my-account" className="flex items-center justify-between w-full py-3 px-5 border-2 border-gray-800 bg-gray-100 text-black tracking-wide rounded-lg hover:bg-white transition-all group">
                      <span>Black with Arrow</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </a>
                    <p className="text-gray-500 mt-2">bg-gray-100 hover:bg-white group-hover:translate-x-1</p>
                  </div>
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
        
        {/* Messaging Section */}
        <section id="messaging" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 pb-2 border-b">Messaging</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Booking Confirmed Message</h3>
              <div className="mb-8 rounded-lg shadow-md overflow-hidden border-2 border-simstudio-yellow">
                {/* Success header with checkmark icon */}
                <div className="p-6 flex items-center">
                  <svg className="w-8 h-8 text-simstudio-yellow mr-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h3>
                    <p className="text-gray-600">We're looking forward to seeing you soon</p>
                  </div>
                </div>
                
                {/* Success content */}
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-6">
                    Your booking has been confirmed and you will receive a confirmation email shortly with all the details.
                  </p>
                </div>
              </div>
              <p className="text-gray-500 mt-2">Booking confirmation message with checkmark icon</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Payment Confirmed Message</h3>
              <div className="rounded-lg shadow-md overflow-hidden mb-4 border-2 border-simstudio-yellow">
                {/* Success header with checkmark icon */}
                <div className="p-6 flex items-center">
                  <svg className="w-8 h-8 text-simstudio-yellow mr-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Payment Confirmed!</h3>
                    <p className="text-gray-600">Thank you for your purchase</p>
                  </div>
                </div>
                
                {/* Success content */}
                <div className="p-6 bg-white">
                  <p className="text-gray-700 mb-4">
                    Your payment has been received and your booking has been confirmed. Your credits have been applied to your booking.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Your reference ID is: <span className="font-medium">ref_123456789</span>
                  </p>
                </div>
              </div>
              <p className="text-gray-500 mt-2">Payment confirmation message from checkout success page</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Payment Required Notice</h3>
              <div className="p-4 bg-yellow-50 rounded-lg border-2 border-simstudio-yellow">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-simstudio-yellow mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-black font-semibold">Payment Required</h4>
                    <p className="text-sm text-black mt-1">
                      You need 2 more credit hours for this booking.
                    </p>
                    <p className="text-sm text-black mt-1">
                      When you click "PROCEED TO CHECKOUT", you'll be taken to Square's secure payment page.
                    </p>
                    <p className="text-sm text-black mt-1">
                      Your booking will be automatically confirmed once payment is complete.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 mt-2">Payment required notice with yellow border</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Payment Completed Notice</h3>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-start">
                  <svg className="w-5 h-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="text-green-800 font-medium">Payment Completed</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your payment has been processed successfully. Click "CONFIRM BOOKING" to finalize your reservation.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 mt-2">Payment completed notice with green styling</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Error Message</h3>
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                There was an error processing your request. Please try again later.
              </div>
              <p className="text-gray-500 mt-2">Error message with red styling</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Tip Message</h3>
              <div className="mb-6 p-4 rounded-lg border-2 border-simstudio-yellow">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">💡</span>
                  <div>
                    <p className="text-black font-semibold">Save more: purchase hour packs for volume discounts.</p>
                    <a href="/shop" className="mt-1 inline-block text-black hover:underline font-medium">Browse Packs <span aria-hidden="true">→</span></a>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 mt-2">Tip message with lightbulb emoji and call-to-action</p>
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
        
        
            
        
      </div>
  );
};

export default StyleGuide;
