import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../../components/layout/PageHeader';
import AboutPageNavigation from '../../components/layout/AboutPageNavigation';

export default function HowToBookPage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader 
        title="How to book"
        subtitle="We've built an intuitive system to make it easy for you to book time in the simulator and add coaching when you need it."
        useCarbonBg={false}
      />

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
           
            
            {/* Booking Steps */}
            <div className="space-y-16 mb-16">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="h-20 w-20 bg-simstudio-yellow rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-4">Create an account</h3>
                  <p className="text-lg">
                    You must have a Sim Studio account before you can book time in the seat. This helps us keep track of your bookings and preferences.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="h-20 w-20 bg-simstudio-yellow rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-4">Tell us about your booking</h3>
                  <p className="text-lg">
                    Select how long your session will be, and add coaching if needed. We offer various session lengths to fit your schedule and goals.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="h-20 w-20 bg-simstudio-yellow rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-4">Choose from available sessions</h3>
                  <p className="text-lg">
                    Find and select a day and time that works for you. Our calendar shows all available slots based on your selected session length.
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="h-20 w-20 bg-simstudio-yellow rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-4">Confirm and pay</h3>
                  <p className="text-lg">
                    Review the details and head on through the checkout to lock it in. You'll receive a confirmation email with all the details of your booking.
                  </p>
                </div>
              </div>
            </div>
            
            {/* About Page Navigation */}
            <AboutPageNavigation />
            
            {/* CTA */}
            <div className="text-center mt-12 bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Ready to book your session?</h2>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link href="/booking" className="border border-gray-800 hover:bg-gray-800 hover:text-white text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  BOOK NOW
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
