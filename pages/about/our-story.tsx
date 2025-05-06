import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../../components/layout/PageHeader';

export default function OurStoryPage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader 
        title="Our story - Why Sim Studio?"
        subtitle="A specialised training facility based around pro-level driving simulators"
        useCarbonBg={false}
      />

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-lg mb-6">
                Sim Studio is a specialised training facility based around pro-level driving simulators, offering both motorsport coaching and road-based driver education.
              </p>
              <p className="text-lg mb-6">
                The studio was founded by a team of passionate driving enthusiasts and professional instructors who recognized the need for accessible, high-quality driver training in a safe environment.
              </p>
              <p className="text-lg mb-6">
                Our South Melbourne studio, opening in May 2025, will feature state-of-the-art driving simulators that provide realistic feedback and immersive experiences for drivers of all skill levels.
              </p>
            </div>
            
            {/* Our Mission */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6">
                At SimStudio, our mission is to improve driving skills, confidence, and safety through accessible, high-quality simulation training. We believe that better drivers make safer roads for everyone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Safety First</h3>
                  <p className="text-lg">
                    We prioritize safety in everything we do, providing a risk-free environment to practice and develop critical driving skills before applying them on the road.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Accessibility</h3>
                  <p className="text-lg">
                    We make driver training accessible to everyone, regardless of experience level, with programs designed to meet you where you are.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Excellence</h3>
                  <p className="text-lg">
                    We strive for excellence in our training methods, technology, and customer service to provide the best possible experience.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Community</h3>
                  <p className="text-lg">
                    We foster a supportive community of drivers who share knowledge, experiences, and a passion for improvement.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Why Simulators? */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Why Simulators?</h2>
              <p className="text-lg mb-6">
                Driving simulators offer unique advantages for driver training that complement real-world experience:
              </p>
              
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <span className="text-lg font-bold">Safety</span>
                    <p className="text-lg">Practice high-risk scenarios without real-world consequences, allowing you to learn from mistakes safely.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <span className="text-lg font-bold">Repeatability</span>
                    <p className="text-lg">Practice the same scenario multiple times to build muscle memory and confidence.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <span className="text-lg font-bold">Data & Feedback</span>
                    <p className="text-lg">Receive immediate, objective feedback on your driving with detailed telemetry and performance metrics.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <span className="text-lg font-bold">Variety</span>
                    <p className="text-lg">Experience different vehicles, road conditions, and environments that might be impractical or impossible to access in real life.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <span className="text-lg font-bold">Cost-Effective</span>
                    <p className="text-lg">Get more practice time for less cost compared to real-world track days or specialized driving courses.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <span className="text-lg font-bold">Environmentally Friendly</span>
                    <p className="text-lg">Reduce carbon emissions while still getting valuable driving experience.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Our Team */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Our Team</h2>
              <p className="text-lg mb-6">
                Our team consists of experienced driving instructors, motorsport coaches, and simulation experts who are passionate about helping drivers of all levels improve their skills.
              </p>
              <p className="text-lg mb-6">
                Each member of our team brings unique expertise and experience to provide comprehensive training that addresses all aspects of driving, from basic vehicle control to advanced racing techniques.
              </p>
              <p className="text-lg">
                Whether you're a new driver looking to build confidence, an experienced driver wanting to refine your skills, or a motorsport enthusiast chasing that perfect lap time, our team is dedicated to helping you achieve your goals.
              </p>
            </div>
            
            {/* CTA */}
            <div className="text-center mt-12 bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Ready to experience SimStudio?</h2>
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
