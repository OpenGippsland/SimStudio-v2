import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../../components/layout/PageHeader';
import AboutPageNavigation from '../../components/layout/AboutPageNavigation';

export default function FacilityPage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader 
        title="Our driver training facility"
        subtitle="The studio has been built with training and education in mind"
        useCarbonBg={false}
      />

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
           
            
            {/* Facility Features */}
            <div className="space-y-16 mb-16">
              {/* Simulators */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">4x pro-level driving simulators</h2>
                <p className="text-lg mb-6">
                  Our simulators have been assembled specifically for our training needs - using high-end Simagic hardware. The simulator configuration is modular and changes from time to time, but each rig will usually have -
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">A comfortable race-style (upright) seat on sliding rails</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">3 pedals (incl clutch)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">A manual shifter (sequential or H pattern) and paddle shift</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">A road (round) or formula-style steering wheel</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">Force feedback steering and pedals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">A high-end gaming PC</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">A single curved 49-inch monitor</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span className="text-lg">Software setup specifically for training</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <img 
                    src="/assets/SimStudioBanner.jpg" 
                    alt="SimStudio Simulator" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
              </div>
              
              {/* Learning Space */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">The Learning Space</h2>
                <p className="text-lg mb-6">
                  A classroom-style space setup for one-on-one and small group training. This space is key to delivering the learning experience alongside simulator seat time.
                </p>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-lg">Comfortable seating for theory and technical sessions</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-lg">Large whiteboard and screen to review driving sessions and deliver learning content</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* The Lounge */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">The Lounge</h2>
                <p className="text-lg mb-6">
                  A comfortable seating area used before and after sessions, including storage for your belongings and cold drinks.
                </p>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/2">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-lg">Relaxed environment for pre and post-session discussions</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-lg">Secure storage for personal items</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-lg">Refreshments available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* About Page Navigation */}
            <AboutPageNavigation />
            
            {/* CTA */}
            <div className="text-center mt-12 bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Ready to experience our facility?</h2>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link href="/booking" className="border border-gray-800 hover:bg-gray-800 hover:text-white text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  BOOK A SESSION
                </Link>
                <Link href="/about" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  BACK TO ABOUT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
