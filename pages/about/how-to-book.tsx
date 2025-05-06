import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../../components/layout/PageHeader';

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
            <p className="text-lg mb-12">
              We've built an intuitive system to make it easy for you to book time in the simulator and add coaching when you need it. Here's an overview of the steps.
            </p>
            
            {/* Booking Steps */}
            <div className="space-y-16 mb-16">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="md:w-1/4 flex justify-center">
                  <div className="h-20 w-20 bg-simstudio-yellow rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-black">1</span>
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
                    <span className="text-3xl font-bold text-black">2</span>
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
                    <span className="text-3xl font-bold text-black">3</span>
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
                    <span className="text-3xl font-bold text-black">4</span>
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
            
            {/* CTA */}
            <div className="text-center mt-12 bg-gray-50 p-8 rounded-lg border border-simstudio-yellow">
              <h2 className="text-2xl font-bold mb-6">Ready to book your session?</h2>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link href="/booking" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  BOOK NOW
                </Link>
                <Link href="/about" className="border border-gray-800 hover:bg-gray-800 hover:text-white text-black font-bold py-3 px-8 rounded-lg transition duration-300">
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
