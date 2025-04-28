import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <div className="carbon-bg text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 heading-font">ABOUT US</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Learn more about SimStudio and our mission to improve driving skills and safety.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 heading-font">OUR STORY</h2>
              <p className="text-lg mb-6">
                SimStudio was founded by a team of passionate driving enthusiasts and professional instructors who recognized the need for accessible, high-quality driver training in a safe environment.
              </p>
              <p className="text-lg mb-6">
                Our South Melbourne studio, opening in May 2025, will feature state-of-the-art driving simulators that provide realistic feedback and immersive experiences for drivers of all skill levels.
              </p>
              <p className="text-lg">
                Whether you're a new driver looking to build confidence, an experienced driver wanting to refine your skills, or a motorsport enthusiast chasing that perfect lap time, SimStudio offers programs tailored to your specific needs and goals.
              </p>
            </div>

            {/* Mission & Values */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 heading-font">OUR MISSION</h2>
              <p className="text-lg mb-6">
                At SimStudio, our mission is to improve driving skills, confidence, and safety through accessible, high-quality simulation training. We believe that better drivers make safer roads for everyone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Safety First</h3>
                  <p>
                    We prioritize safety in everything we do, providing a risk-free environment to practice and develop critical driving skills before applying them on the road.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Accessibility</h3>
                  <p>
                    We make driver training accessible to everyone, regardless of experience level, with programs designed to meet you where you are.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Excellence</h3>
                  <p>
                    We strive for excellence in our training methods, technology, and customer service to provide the best possible experience.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Community</h3>
                  <p>
                    We foster a supportive community of drivers who share knowledge, experiences, and a passion for improvement.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Facility */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 heading-font">OUR FACILITY</h2>
              <div className="flex flex-col md:flex-row items-center mb-8">
                <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                  <img 
                    src="/assets/SimStudioBanner.jpg" 
                    alt="SimStudio Facility" 
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
                <div className="md:w-1/2">
                  <p className="text-lg mb-4">
                    Our South Melbourne studio features:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>4 professional-grade driving simulators</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Comfortable, climate-controlled environment</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Debriefing areas for coaching sessions</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Advanced telemetry and recording capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Lounge area with refreshments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <h2 className="text-2xl font-bold mb-6">Ready to experience SimStudio?</h2>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link href="/booking" className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  BOOK A SESSION
                </Link>
                <Link href="/contact" className="bg-transparent border-2 border-simstudio-yellow text-simstudio-yellow hover:bg-simstudio-yellow hover:text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
