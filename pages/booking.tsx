import React, { useState, useEffect } from 'react';
import BookingForm from '../components/BookingForm';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useSession } from 'next-auth/react';

export default function BookingPage() {
  const { user, authUser, loading } = useAuth();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [credits, setCredits] = useState<{ simulator_hours: number, coaching_sessions: number } | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('booking');

  // Fetch user credits
  const fetchCredits = async () => {
    if (!user) return;
    
    setCreditsLoading(true);
    try {
      const response = await fetch(`/api/user-credits?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCredits({
          simulator_hours: data.simulator_hours || 0,
          coaching_sessions: data.coaching_sessions || 0
        });
      } else {
        console.error('Failed to fetch user credits');
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setCreditsLoading(false);
    }
  };

  // Fetch credits when user is loaded
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchCredits();
    }
  }, [user, isAuthenticated]);

  return (
    <>
      <Head>
        <title>Book a Session | SimStudio</title>
      </Head>
      
      {/* Page Header */}
      <div className="carbon-bg text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 heading-font">BOOK A SESSION</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Reserve your simulator time and take the first step towards improving your driving skills.
          </p>
        </div>
      </div>

      {/* Booking Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <p className="text-center">Loading user information...</p>
              </div>
            ) : (
              <>
                {/* User Info or Login Notice */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  {isAuthenticated ? (
                    <>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {authUser?.name || user?.email}</h2>
                      
                      {/* Credits Information */}
                      {creditsLoading ? (
                        <p className="text-gray-500 mb-4">Loading credits...</p>
                      ) : credits ? (
                        <div className="mb-4 grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-gray-600 text-sm mb-1">Simulator Hours</p>
                            <p className="text-xl font-bold text-simstudio-yellow">
                              {credits.simulator_hours}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <p className="text-gray-600 text-sm mb-1">Coaching Sessions</p>
                            <p className="text-xl font-bold text-simstudio-yellow">
                              {credits.coaching_sessions}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      
                      <div className="flex space-x-4 justify-center">
                        <Link href="/my-account" className="px-4 py-2 border border-simstudio-yellow text-black rounded hover:border-yellow-400 transition">
                          Manage My Bookings
                        </Link>
                        <Link href="/packages" className="px-4 py-2 border border-gray-800 text-gray-800 rounded hover:border-gray-700 transition">
                          Add Credits
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login Required</h2>
                      <p className="text-gray-600 mb-4">
                        You need to be logged in to complete a booking. You can browse available sessions, but you'll need to sign in to confirm your booking.
                      </p>
                      <div className="flex space-x-4 justify-center">
                        <Link href="/auth/login?redirect=/booking" className="px-4 py-2 border border-simstudio-yellow text-black rounded hover:border-yellow-400 transition">
                          Sign In
                        </Link>
                        <Link href="/auth/register?redirect=/booking" className="px-4 py-2 border border-gray-800 text-gray-800 rounded hover:border-gray-700 transition">
                          Create Account
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('booking')}
                      className={`py-4 px-1 font-medium text-sm border-b-2 ${
                        activeTab === 'booking'
                          ? 'border-simstudio-yellow text-simstudio-yellow'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Book a Session
                    </button>
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`py-4 px-1 font-medium text-sm border-b-2 ${
                        activeTab === 'info'
                          ? 'border-simstudio-yellow text-simstudio-yellow'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Booking Information
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'booking' && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book a Simulator</h2>
                    <BookingForm 
                      onSuccess={() => {}} 
                      selectedUserId={user ? user.id.toString() : ''} 
                    />
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Booking Information</h2>
                    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Important Details</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Sessions can be booked in 1-hour increments</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Optional coaching is available with our professional instructors</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Cancellations must be made at least 24 hours in advance</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Please arrive 15 minutes before your scheduled session</span>
                        </li>
                      </ul>

                      <h3 className="text-xl font-bold mb-4 mt-8 text-simstudio-yellow">Simulator Features</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Professional-grade racing simulators with motion platforms</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Multiple track configurations and vehicle options</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Performance analytics and lap time tracking</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-simstudio-yellow mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Realistic force feedback and immersive audio</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
