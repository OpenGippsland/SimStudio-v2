import React, { useState, useEffect } from 'react';
import BookingForm from '../components/BookingForm';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useSession } from 'next-auth/react';
import PageHeader from '../components/layout/PageHeader';

export default function BookingPage() {
  const { user, authUser, loading } = useAuth();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [credits, setCredits] = useState<{ simulator_hours: number, coaching_sessions: number } | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);
  // No longer need activeTab state since we removed the tabs

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
      <PageHeader 
        title="BOOK A SESSION"
        subtitle="Reserve your simulator time and take the first step towards improving your driving skills."
        useCarbonBg={false}
      />

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
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center md:justify-between">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">Welcome, {user?.name || user?.email}</h2>
                          {creditsLoading ? (
                            <p className="text-sm text-gray-500">Loading credits...</p>
                          ) : credits ? (
                            <p className="text-sm">
                              <span className="text-gray-600">Available Hours:</span> 
                              <span className="font-bold text-simstudio-yellow ml-1">{credits.simulator_hours}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-4 md:mt-0">
                        <Link href="/my-account" className="px-3 py-1 text-sm border border-simstudio-yellow text-black rounded hover:border-yellow-400 transition">
                          My Bookings
                        </Link>
                        <Link href="/shop" className="px-3 py-1 text-sm border border-gray-800 text-gray-800 rounded hover:border-gray-700 transition">
                          Add Credits
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">Login Required</h2>
                        <p className="text-sm text-gray-600">
                          Sign in to complete your booking
                        </p>
                      </div>
                      <div className="flex space-x-3 mt-4 md:mt-0">
                        <Link href="/auth/login?redirect=/booking" className="px-3 py-1 text-sm border border-simstudio-yellow text-black rounded hover:border-yellow-400 transition">
                          Sign In
                        </Link>
                        <Link href="/auth/register?redirect=/booking" className="px-3 py-1 text-sm border border-gray-800 text-gray-800 rounded hover:border-gray-700 transition">
                          Create Account
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Booking Form */}
                <div className="mb-8">
                  <BookingForm 
                    onSuccess={() => {}} 
                    selectedUserId={user ? user.id.toString() : ''}
                  />
                </div>
                
                {/* Booking Information */}
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
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
