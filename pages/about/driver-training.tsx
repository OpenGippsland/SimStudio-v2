import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../../components/layout/PageHeader';

export default function DriverTrainingPage() {
  return (
    <>
      {/* Page Header */}
      <PageHeader 
        title="Driver training and education"
        subtitle="The first dedicated simulator-based driver training facility of its type in Australia"
        useCarbonBg={false}
      />

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-lg mb-6">
                Sim Studio is the first dedicated simulator-based driver training facility of its type in Australia, filling a gap in both motorsport coaching and road driver education. Unlike traditional training models, we provide structured, professional coaching using state-of-the-art simulators.
              </p>
              <p className="text-lg mb-6">
                Initially we are working with a 'meet you where you're at' model, meaning whatever level of driving you are up to, from 'have never driven before' through to 'taking your motorsport career seriously', we have the experience and expertise to help you move forward. We welcome you to <Link href="/contact" className="text-simstudio-yellow hover:underline">contact us</Link> so we can chat about your situation.
              </p>
              <p className="text-lg mb-6">
                As demand grows, we are building more structured and focussed education content for both on-road and race track training - these will be rolled out as soon as we have them ready. Here's a snapshot of the kinds of things we are working on -
              </p>
            </div>
            
            {/* On-Road Focus */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">On-Road focus</h2>
              <p className="text-lg mb-6">
                Our on-road focused training includes:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Guided training programs for learner drivers to advanced road users</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Courses designed for specific learning outcomes</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Training available as one-on-one coaching or small-group sessions</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mb-4">Pre-road driver training</h3>
              <p className="text-lg mb-6">
                Designed for learners before they start driving on the road, our pre-road training covers:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Fundamental skills such as vehicle control, hazard recognition, road awareness, and confidence building</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Getting comfortable behind the wheel in a controlled, stress-free environment</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Precursor to real-world lessons with a driving instructor or parent</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mb-4">Advanced and performance driver training</h3>
              <p className="text-lg mb-6">
                For licensed drivers looking to improve their skills:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Defensive driving, accident avoidance, wet-weather handling, and night driving</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Useful for nervous drivers, parents wanting their teens to gain extra confidence, or those seeking higher-level road skills</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Performance driving, specifically aimed at those wanting the skills and confidence to enjoy their car in a safe manner - this level leads into our track focussed programs</span>
                </li>
              </ul>
            </div>
            
            {/* Race Track Focus */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Race Track focus</h2>
              <p className="text-lg mb-6">
                Formalized motorsport education programs:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Structured courses with a clear progression system (Level 1 → Level 2, etc)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Combination of classroom learning, simulator training, and real-world applications</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Designed for drivers who want to seriously progress their motorsport careers</span>
                </li>
              </ul>
            </div>
            
            {/* Group Training Programs */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Group Training Programs</h2>
              <p className="text-lg mb-6">
                Plans are underway to expand into structured group programs for schools, community groups, and corporate clients.
              </p>
              
              <h3 className="text-xl font-bold mb-4">School-Based Driver Education</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Partnerships with schools to offer structured courses</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Could be delivered as an extracurricular elective or an integrated school program</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Programs being piloted in terms 2 and 3, <Link href="/contact" className="text-simstudio-yellow hover:underline">contact us</Link> if your school is interested</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mb-4">Youth & Community Training Programs</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Programs designed for Scouts, youth groups, and sports clubs</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Could include road safety awareness workshops followed by simulator training</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Delivered in partnership with community organizations</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mb-4">Corporate & Fleet Training</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Group sessions for employee driver safety</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Used for fleet training, risk reduction, or employee driving skill assessments</span>
                </li>
              </ul>
            </div>
            
            {/* CTA */}
            <div className="text-center mt-12 bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Ready to improve your driving skills?</h2>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link href="/booking" className="border border-gray-800 hover:bg-gray-800 hover:text-white text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  BOOK A SESSION
                </Link>
                <Link href="/contact" className="border border-simstudio-yellow hover:bg-simstudio-yellow/10 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  CONTACT US
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
