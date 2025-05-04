import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import Head from 'next/head'
import PackageManager from '../components/PackageManager'
import UserCreditsManager from '../components/UserCreditsManager'
import CoachAvailabilityForm from '../components/CoachAvailabilityForm'
import BusinessHoursForm from '../components/admin/BusinessHoursForm'
import SpecialDatesForm from '../components/admin/SpecialDatesForm'
import BookingsManager from '../components/admin/BookingsManager'
import UserManager from '../components/admin/UserManager'
import CoachProfileManager from '../components/admin/CoachProfileManager'

// Main Admin Page
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('bookings')
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // Check if user has admin or coach role
  useEffect(() => {
    if (user && !(user.is_admin || user.is_coach)) {
      // Redirect unauthorized users to home page
      router.push('/')
    }
  }, [user, router])

  // Show loading state or nothing while checking permissions
  if (loading || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }
  
  // If user is not admin or coach, don't render anything (will be redirected)
  if (!(user.is_admin || user.is_coach)) {
    return null
  }

  // Only render admin content if user has proper permissions
  return (
    <>
      <Head>
        <title>Admin Dashboard | SimStudio</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <Link href="/" className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg">
              Back to Home
            </Link>
          </div>
          
          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'bookings'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'users'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('business-hours')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'business-hours'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Business Hours
              </button>
              <button
                onClick={() => setActiveTab('special-dates')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'special-dates'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Special Dates
              </button>
              <button
                onClick={() => setActiveTab('packages')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'packages'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Packages
              </button>
              <button
                onClick={() => setActiveTab('user-credits')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'user-credits'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Credits
              </button>
              <button
                onClick={() => setActiveTab('coach-profiles')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'coach-profiles'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Coach Profiles
              </button>
              <button
                onClick={() => setActiveTab('coach-availability')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'coach-availability'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Coach Availability
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mb-8">
            {activeTab === 'users' && <UserManager />}
            {activeTab === 'bookings' && <BookingsManager />}
            {activeTab === 'business-hours' && <BusinessHoursForm />}
            {activeTab === 'special-dates' && <SpecialDatesForm />}
            {activeTab === 'packages' && <PackageManager />}
            {activeTab === 'user-credits' && <UserCreditsManager />}
            {activeTab === 'coach-profiles' && <CoachProfileManager />}
            {activeTab === 'coach-availability' && <CoachAvailabilityForm />}
          </div>
        </div>
      </div>
    </>
  )
}
