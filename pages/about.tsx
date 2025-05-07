import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/layout/PageHeader';
import GlobalCTA from '../components/ui/GlobalCTA';

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader 
        title="Let's talk about Sim Studio"
        subtitle="Learn more about our driver coaching and education services"
        useCarbonBg={false}
      />

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* About Section Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* How to book */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-4">How to book</h2>
                  <p className="flex-grow">We've built an intuitive system to make it easy for you to book time in the simulator and add coaching when you need it.</p>
                  <div className="mt-auto pt-6">
                    <Link href="/about/how-to-book" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300 block w-full text-center">
                      Booking Guide
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* The Facility */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-4">The Facility</h2>
                  <p className="flex-grow">The studio has been built with training and education in mind. Here's what to expect when you visit.</p>
                  <div className="mt-auto pt-6">
                    <Link href="/about/facility" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300 block w-full text-center">
                      Our Facility
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Driver Training */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-4">Driver Training</h2>
                  <p className="flex-grow">Sim Studio is the first dedicated simulator-based driver training facility of its type in Australia.</p>
                  <div className="mt-auto pt-6">
                    <Link href="/about/driver-training" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300 block w-full text-center">
                      Training Programs
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Our Story */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                  <p className="flex-grow">Shine a light on Sim Studio - read about our story and the future of driver training and education.</p>
                  <div className="mt-auto pt-6">
                    <Link href="/about/our-story" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300 block w-full text-center">
                      Our Story
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* FAQs */}
              <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold mb-4">FAQs</h2>
                  <p className="flex-grow">Make sure you check out our FAQs to answer most commonly asked questions, and contact us if you'd like to know more.</p>
                  <div className="mt-auto pt-6">
                    <Link href="/about/faqs" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300 block w-full text-center">
                      Simulator FAQs
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Global CTA */}
            <div className="mt-16">
              <GlobalCTA />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
