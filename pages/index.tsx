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
        bgImage="/assets/simhero.jpeg"
        bgImageOpacity={50}
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md border border-simstudio-yellow">
              <div className="h-16 w-16 bg-simstudio-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Create an account</h3>
            </div>
            
            {/* Step 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md border border-simstudio-yellow">
              <div className="h-16 w-16 bg-simstudio-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Tell us about your booking</h3>
            </div>
            
            {/* Step 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md border border-simstudio-yellow">
              <div className="h-16 w-16 bg-simstudio-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Choose from available sessions</h3>
            </div>
            
            {/* Step 4 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md border border-simstudio-yellow">
              <div className="h-16 w-16 bg-simstudio-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Confirm and pay</h3>
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
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow">
              <h3 className="text-xl font-bold text-center mb-4">Frequently Asked Questions</h3>
              <p className="text-gray-700 text-center mb-6">
                Have questions about our services, facility, or how it all works? Check out our FAQs for answers.
              </p>
              <div className="text-center">
                <Link href="/about/faqs" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                  READ FAQs
                </Link>
              </div>
            </div>
            
            {/* About Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow">
              <h3 className="text-xl font-bold text-center mb-4">About Sim Studio</h3>
              <p className="text-gray-700 text-center mb-6">
                Learn more about our facility, our story, and our approach to driver training and education.
              </p>
              <div className="text-center">
                <Link href="/about" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-2 px-6 rounded-lg transition duration-300">
                  ABOUT US
                </Link>
              </div>
            </div>
            
            {/* Contact Card */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-simstudio-yellow">
              <h3 className="text-xl font-bold text-center mb-4">Contact Us</h3>
              <p className="text-gray-700 text-center mb-6">
                Still not sure or have more questions? Get in touch with us directly.
              </p>
              <div className="text-center">
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
                <Link href="/shop" className="border border-gray-800 hover:bg-gray-800 hover:text-white text-black font-bold py-2 px-6 rounded-lg transition duration-300">
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
