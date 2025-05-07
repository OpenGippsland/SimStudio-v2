import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import PageHeader from '../components/layout/PageHeader';

interface HomeProps {
  selectedUserId?: string;
}

export default function Home({ selectedUserId }: HomeProps) {
  return (
    <>
      {/* Hero Section */}
      <PageHeader 
        title="Serious about driving? So are we."
        subtitle="Our driving simulator training facility offers structured coaching, guided programs, and regular seat time - designed to help build skills, confidence, and performance on the road or on the track."
        useCarbonBg={true}
        buttons={
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/booking" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              BOOK NOW
            </Link>
            <Link href="/about" className="border border-gray-800 hover:bg-gray-800 hover:text-white text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              LEARN MORE
            </Link>
          </div>
        }
      />

      {/* How it works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          
          {/* Desktop Flow (hidden on mobile) */}
          <div className="hidden md:block max-w-5xl mx-auto">
              <div className="relative">
                {/* Grey line connecting steps */}
                <div className="absolute top-8 left-[8%] right-[8%] h-0.5 bg-gray-300 z-0"></div>
                {/* Steps Container */}
                <div className="relative flex justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center w-1/4 px-4 group">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 text-black font-bold text-xl shadow-md transition-all duration-300 group-hover:scale-110 border-2 border-simstudio-yellow">
                    1
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-2 w-full h-32 flex flex-col">
                    <h3 className="text-lg font-bold text-center mb-2">Create an account</h3>
                    <p className="text-gray-600 text-center text-sm">Sign up to get started</p>
                  </div>
                  
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center w-1/4 px-4 group">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 text-black font-bold text-xl shadow-md transition-all duration-300 group-hover:scale-110 border-2 border-simstudio-yellow">
                    2
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-2 w-full h-32 flex flex-col">
                    <h3 className="text-lg font-bold text-center mb-2">Tell us about your booking</h3>
                    <p className="text-gray-600 text-center text-sm">Select your preferences</p>
                  </div>
                  
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center w-1/4 px-4 group">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 text-black font-bold text-xl shadow-md transition-all duration-300 group-hover:scale-110 border-2 border-simstudio-yellow">
                    3
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-2 w-full h-32 flex flex-col">
                    <h3 className="text-lg font-bold text-center mb-2">Choose available sessions</h3>
                    <p className="text-gray-600 text-center text-sm">Pick your time slot</p>
                  </div>
                  
                </div>
                
                {/* Step 4 */}
                <div className="flex flex-col items-center w-1/4 px-4 group">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 text-black font-bold text-xl shadow-md transition-all duration-300 group-hover:scale-110 border-2 border-simstudio-yellow">
                    4
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-2 w-full h-32 flex flex-col">
                    <h3 className="text-lg font-bold text-center mb-2">Confirm and pay</h3>
                    <p className="text-gray-600 text-center text-sm">Complete your booking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Flow (hidden on desktop) */}
          <div className="md:hidden max-w-sm mx-auto">
            <div className="relative pl-16">
              {/* Step 1 */}
              {/* Grey line connecting steps */}
              <div className="absolute top-12 bottom-12 left-0 w-0.5 bg-gray-300 z-0"></div>
              
              <div className="relative mb-16 group">
                <div className="absolute top-0 left-0 -translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white rounded-full text-black font-bold text-lg shadow-md border-2 border-simstudio-yellow transition-all duration-300 group-hover:scale-110">
                  1
                </div>
                
                <div className="ml-10 bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-1 h-24 flex flex-col">
                  <h3 className="text-lg font-bold mb-1">Create an account</h3>
                  <p className="text-gray-600 text-sm">Sign up to get started</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative mb-16 group">
                <div className="absolute top-0 left-0 -translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white rounded-full text-black font-bold text-lg shadow-md border-2 border-simstudio-yellow transition-all duration-300 group-hover:scale-110">
                  2
                </div>
                
                <div className="ml-10 bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-1 h-24 flex flex-col">
                  <h3 className="text-lg font-bold mb-1">Tell us about your booking</h3>
                  <p className="text-gray-600 text-sm">Select your preferences</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative mb-16 group">
                <div className="absolute top-0 left-0 -translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white rounded-full text-black font-bold text-lg shadow-md border-2 border-simstudio-yellow transition-all duration-300 group-hover:scale-110">
                  3
                </div>
                
                <div className="ml-10 bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-1 h-24 flex flex-col">
                  <h3 className="text-lg font-bold mb-1">Choose available sessions</h3>
                  <p className="text-gray-600 text-sm">Pick your time slot</p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative group">
                <div className="absolute top-0 left-0 -translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 bg-white rounded-full text-black font-bold text-lg shadow-md border-2 border-simstudio-yellow transition-all duration-300 group-hover:scale-110">
                  4
                </div>
                <div className="ml-10 bg-white p-5 rounded-lg shadow-md border border-gray-100 transition-all duration-300 group-hover:-translate-y-1 h-24 flex flex-col">
                  <h3 className="text-lg font-bold mb-1">Confirm and pay</h3>
                  <p className="text-gray-600 text-sm">Complete your booking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Is this for me? Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Is this for me?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FAQ Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow flex flex-col h-full">
              <h3 className="text-xl font-bold text-center mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-700 text-center flex-grow">
                Have questions about our services, facility, or how it all works? Check out our FAQs for answers.
              </p>
              <div className="text-center mt-auto pt-6">
                <Link href="/about/faqs" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                  READ FAQs
                </Link>
              </div>
            </div>
            
            {/* About Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow flex flex-col h-full">
              <h3 className="text-xl font-bold text-center mb-4">About Sim Studio</h3>
              <p className="text-gray-700 text-center flex-grow">
                Learn more about our facility, our story, and our approach to driver training and education.
              </p>
              <div className="text-center mt-auto pt-6">
                <Link href="/about" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                  ABOUT US
                </Link>
              </div>
            </div>
            
            {/* Contact Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow flex flex-col h-full">
              <h3 className="text-xl font-bold text-center mb-4">Contact Us</h3>
              <p className="text-gray-700 text-center flex-grow">
                Still not sure or have more questions? Get in touch with us directly.
              </p>
              <div className="text-center mt-auto pt-6">
                <Link href="/contact" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Let's get started Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Let's get started</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Book Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow text-black">
              <h3 className="text-xl font-bold text-center mb-4">Book a Session</h3>
              <p className="text-gray-700 text-center mb-6">
                Ready to get in the seat? Book a simulator session with or without coaching.
              </p>
              <div className="text-center">
                <Link href="/booking" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                  BOOK NOW
                </Link>
              </div>
            </div>
            
            {/* Shop Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow text-black">
              <h3 className="text-xl font-bold text-center mb-4">Buy Simulator Time</h3>
              <p className="text-gray-700 text-center mb-6">
                Save by purchasing simulator time in packs of hours that you can use anytime.
              </p>
              <div className="text-center">
                <Link href="/shop" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
