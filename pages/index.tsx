import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

interface HomeProps {
  selectedUserId?: string;
}

export default function Home({ selectedUserId }: HomeProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="carbon-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 heading-font">
              DRIVER TRAINING & EDUCATION
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              <span className="text-white">Serious about driving?</span>
              <span className="text-simstudio-yellow"> So are we.</span>
            </p>
            <p className="text-lg mb-8">
              Our driving simulator training facility offers structured coaching, guided programs, and regular seat time - designed to help build skills, confidence, and performance on the road or on the track.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link href="/booking" className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                BOOK NOW
              </Link>
              <Link href="/about" className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 heading-font">OUR SERVICES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="h-16 w-16 bg-simstudio-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Simulator Sessions</h3>
              <p className="text-gray-700 text-center">
                Book simulator time to practice your skills in a safe, controlled environment with realistic feedback.
              </p>
            </div>
            
            {/* Service 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="h-16 w-16 bg-simstudio-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Professional Coaching</h3>
              <p className="text-gray-700 text-center">
                Work with our experienced coaches to improve your technique, confidence, and performance.
              </p>
            </div>
            
            {/* Service 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="h-16 w-16 bg-simstudio-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Training Programs</h3>
              <p className="text-gray-700 text-center">
                Structured programs for road or racing confidence, tailored to your skill level and goals.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/booking" className="inline-block bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
              EXPLORE OUR SERVICES
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <img 
                src="/assets/SimStudioBanner.jpg" 
                alt="SimStudio Facility" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 heading-font">ABOUT SIM STUDIO</h2>
              <p className="text-lg mb-6">
                South Melbourne studio opening May 2025. Our driving simulator training facility offers structured coaching, guided programs, and regular seat time - designed to help build skills, confidence, and performance on the road or on the track.
              </p>
              
              <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">WHO IS IT FOR?</h3>
              <p className="mb-4">Whether you're just starting out or chasing the last tenth, our safe, inclusive studio helps drivers at every level build real-world skills and confidence.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Book simulator sessions for extra seat time</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Work with a coach to sharpen your technique</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Tackle structured training programs for road or racing confidence</span>
                </li>
              </ul>
              
              <Link href="/about" className="inline-block bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                LEARN MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="carbon-bg text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 heading-font">READY TO GET STARTED?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Book your simulator session today and take the first step towards improving your driving skills.
          </p>
          <Link href="/booking" className="inline-block bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
            BOOK NOW
          </Link>
        </div>
      </section>
    </>
  );
}
