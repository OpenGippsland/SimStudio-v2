import React from 'react';
import BookingForm from '../components/BookingForm';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useSession } from 'next-auth/react';

export default function BookingPage() {
  const { user, loading } = useAuth();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <>
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
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {user?.email}</h2>
                      <p className="text-gray-600 mb-4">
                        <span className="font-bold">Account ID: {user?.id}</span>
                      </p>
                      <div>
                        <Link href="/bookings" className="px-4 py-2 bg-simstudio-yellow text-black rounded hover:bg-yellow-400 transition">
                          Manage My Bookings
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login Required</h2>
                      <p className="text-gray-600 mb-4">
                        You need to be logged in to complete a booking. You can browse available sessions, but you'll need to sign in to confirm your booking.
                      </p>
                      <div className="flex space-x-4">
                        <Link href="/auth/login?redirect=/booking" className="px-4 py-2 bg-simstudio-yellow text-black rounded hover:bg-yellow-400 transition">
                          Sign In
                        </Link>
                        <Link href="/auth/register?redirect=/booking" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
                          Create Account
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Booking Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book a Simulator</h2>
                  <BookingForm 
                    onSuccess={() => {}} 
                    selectedUserId={user ? user.id.toString() : ''} 
                  />
                </div>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 shadow-md mt-8">
              <h3 className="text-xl font-bold mb-4 text-simstudio-yellow">Booking Information</h3>
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

            <div className="text-center mt-8">
              <Link href="/packages" className="inline-block bg-simstudio-yellow hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-300">
                BUY SIMULATOR HOURS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
