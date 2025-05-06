import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../../components/layout/PageHeader';

// FAQ Item component with accordion functionality
const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-bold text-lg focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div className={`mt-2 text-gray-700 ${isOpen ? 'block' : 'hidden'}`}>
        {answer}
      </div>
    </div>
  );
};

export default function FAQsPage() {
  // Array of FAQ items
  const faqs = [
    {
      question: "What are you opening hours?",
      answer: "Checkout our contact us page for current opening times and days."
    },
    {
      question: "Where are you located?",
      answer: "The studio is located in South Melbourne, VIC - checkout our contact us page for directions."
    },
    {
      question: "Do I need a booking?",
      answer: "Yes, we are not open for 'walk ups' - if you're not comfortable using the online booking tool or want to pop in to see us before booking just contact us first."
    },
    {
      question: "Do I need a coach?",
      answer: "No, booking seat time in the simulator to get your hours up is totally fine - but coaching will help you improve faster."
    },
    {
      question: "What should I bring?",
      answer: "Comfortable, cool clothes (it gets warm driving), your best socks (often students prefer to drive without shoes) and a water bottle is recommended."
    },
    {
      question: "I've never driven a car before, can you help?",
      answer: "Yes, we are happy to start right from the start if that's where you're at."
    },
    {
      question: "I've never driven a simulator, can you help?",
      answer: "Your first time in a driving simulator can be daunting, it's an immersive experience with plenty to take in - all first time students will go through onboarding and support to get you going."
    },
    {
      question: "I've been driving for years, will I learn anything new?",
      answer: "You may have been making the same mistakes for years - there's always room to learn more and improve your driving."
    },
    {
      question: "Can I bring people to watch?",
      answer: "Sim Studio is not set up for spectating, so we ask that you keep the entourage to zero - we do welcome parents or partners on occasion by prior arrangement."
    },
    {
      question: "Can I book the same time every week?",
      answer: "We are not set up for recurring bookings in the system yet, but this is coming soon. Until then you can book as many individual sessions as you like, and if you need help with this just contact us."
    },
    {
      question: "I want to drive with my mates, can I do a group booking?",
      answer: "Yes, we can handle small groups of up to 4 drivers and also have a range of options for larger groups with shared seat time - just contact us so we can get you booked in."
    },
    {
      question: "What sort of simulator gear do you use at Sim Studio?",
      answer: "We use Simagic simulator hardware - for more info about our rigs checkout the Facility info."
    },
    {
      question: "I need to cancel, what do I do?",
      answer: "Things happen - we allow cancellations up until 24 hours before your booking."
    },
    {
      question: "I am a driving instructor or coach, can I use your facility with my students?",
      answer: "Yes, we work with a number of partner instructors and coaches who book seat time for their students and provide their coaching expertise - just contact us to set this up."
    }
  ];

  return (
    <>
      {/* Page Header */}
      <PageHeader 
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Sim Studio"
        useCarbonBg={false}
      />

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg mb-12">
              Make sure you check out our FAQs to answer most commonly asked questions, and contact us if you'd like to know more.
            </p>
            
            {/* FAQ Accordion */}
            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  question={faq.question} 
                  answer={
                    <p className="py-2">
                      {faq.answer.includes('contact us') ? (
                        <>
                          {faq.answer.split('contact us').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <Link href="/contact" className="text-simstudio-yellow hover:underline">
                                  contact us
                                </Link>
                              )}
                            </React.Fragment>
                          ))}
                        </>
                      ) : faq.answer.includes('Facility') ? (
                        <>
                          {faq.answer.split('Facility').map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && (
                                <Link href="/about/facility" className="text-simstudio-yellow hover:underline">
                                  Facility
                                </Link>
                              )}
                            </React.Fragment>
                          ))}
                        </>
                      ) : (
                        faq.answer
                      )}
                    </p>
                  } 
                />
              ))}
            </div>
            
            {/* CTA */}
            <div className="text-center mt-12 bg-gray-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Still have questions?</h2>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link href="/contact" className="border border-gray-800 hover:bg-gray-800 hover:text-white text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                  CONTACT US
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
