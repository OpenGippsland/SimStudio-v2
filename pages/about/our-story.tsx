import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../../components/layout/PageHeader';
import AboutPageNavigation from '../../components/layout/AboutPageNavigation';

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
            </div>
            
            {/* There is a gap */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">There is a gap</h2>
              <p className="text-lg mb-6">
                On the road, parents, driving schools, and individuals need a safe, structured environment for learners and advanced road safety education, with limited options available outside of real-world driving.
              </p>
              <p className="text-lg mb-6">
                In Motorsport, simulators have become an essential tool for race drivers - but there are no dedicated simulator-based coaching studios in Australia offering structured, high-level coaching - until now.
              </p>
            </div>
            
            {/* Road or Race? */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Road or Race?</h2>
              <p className="text-lg mb-6">
                Why not both?!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Road focus</h3>
                  <p className="text-lg">
                    Designed for learner drivers, advanced road safety training, and individuals looking to build confidence in a controlled, risk-free setting.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Race focus</h3>
                  <p className="text-lg">
                    Focused on motorsport coaching for drivers looking to enhance their skills, train for competitions, and maximise their performance in a structured environment.
                  </p>
                </div>
              </div>
              
              <p className="text-lg mt-8">
                By utilizing professional-grade simulators, Sim Studio provide a cost-effective, accessible, and highly efficient alternative to traditional driver training.
              </p>
            </div>
            
            {/* Where We Are Now */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Where We Are Now</h2>
              <p className="text-lg mb-6">
                Simulators are fast becoming recognised as essential for driver development - traditional driving schools focus on passing the driving test, but few offer risk-free simulator-based training to build real-world skills before getting behind the wheel.
              </p>
              <p className="text-lg mb-6">
                At Sim Studio, we believe there is a unique opportunity to create a specialized driver training business that meets the demands of both race drivers and everyday road users.
              </p>
            </div>
            
            {/* Where We Want to Be */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Where We Want to Be</h2>
              <p className="text-lg mb-6">
                Our goal is to establish Sim Studio as the go-to destination for structured, simulator-based driver training.
              </p>
              <p className="text-lg mb-6">
                In the short term, this means opening the facility in South Melbourne (May 2025), develop initial training programs and partnerships, with a focus on driver education.
              </p>
              <p className="text-lg mb-6">
                As we move forward, Sim Studio hopes to build relationships and partnerships with schools, corporate and the motorsport community, and to expand out to multiple locations (including interstate).
              </p>
            </div>
            
            {/* The Sim Studio difference */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">The Sim Studio difference</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-lg">Structured, professional coaching: Unlike home-based simulator setups, our programs are designed and delivered by experienced driver coaches</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-lg">Bridging motorsport and road safety: We cater to both aspiring race drivers and every day road users, making us the most versatile simulator training facility in the country</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-lg">Cost-effective alternative to track-based training: Motorsport coaching is expensive due to track hire, vehicle maintenance, and travel costs—our facility provides an affordable way to train with real-time feedback</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-lg">Safe, risk-free learning environment: For learner drivers and those advancing their road skills, simulator training offers a controlled space to practice without real-world dangers like traffic or weather conditions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-lg">Open access for professionals and businesses: Our facility is available for race teams, coaches, and driving schools to integrate simulator training into their own programs</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Benefits of Simulator-Based Training */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Benefits of Simulator-Based Training</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Motorsport Clients</h3>
                  <p className="text-lg">
                    More seat time at a lower cost, enhanced feedback loops, and the ability to train for any track, any conditions, any time.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Road Training Clients</h3>
                  <p className="text-lg">
                    Learn and refine skills in a controlled, pressure-free setting, with an emphasis on building confidence before taking to the road.
                  </p>
                </div>
              </div>
              
              <p className="text-lg mt-8">
                It's more than just a simulator experience—it's a professional training facility designed to develop safer, more skilled drivers at all levels.
              </p>
            </div>
            
            {/* Team & Expertise */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Team & Expertise</h2>
              
              <h3 className="text-xl font-bold mb-4">Founder's Background & Motorsport Experience</h3>
              <p className="text-lg mb-6">
                Sim Studio is founded by someone with a lifelong connection to motorsport, combining hands-on racing experience with a practical, structured approach to coaching.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Motorsport has been a big part of life from an early age, influenced by a father who was passionate about Formula 1 in the 70s, 80s, and 90s</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Started racing go-karts in the late 80s, competing throughout his teenage years, experiencing the role karting plays in driver development</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Moved into car racing, later working with race teams, gaining first-hand industry experience</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Has attended racing events and tracks around the world, including Motegi, Suzuka and Sepang recently</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Brings an engineering-focused approach to motorsport, with a strong understanding of data logging, performance tuning, and race strategy</span>
                </li>
              </ul>
              
              <h3 className="text-xl font-bold mb-4">Coaching & Training Approach</h3>
              <p className="text-lg mb-6">
                Sim Studio take a structured, practical approach to driver training, combining motorsport experience with effective coaching methods.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Worked as a performance driver coach, including coaching roles with motorsport teams and Mercedes-Benz AMG</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Unlike many ex-racers who become coaches, brings experience in training and consulting, having spent years running workshops and structured learning programs in corporate settings</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-simstudio-yellow mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-lg">Focuses on education at every level - making driving techniques clear and easy to apply, helping drivers improve faster</span>
                </li>
              </ul>
            </div>
            
            {/* About Page Navigation */}
            <AboutPageNavigation />
            
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
