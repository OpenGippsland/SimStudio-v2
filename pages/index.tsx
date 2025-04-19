import React from 'react'
import Link from 'next/link'
import BookingForm from '../components/BookingForm'
import Head from 'next/head'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>SimStudio - Flight Simulator Booking System</title>
      </Head>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Sim Studio Booking System</h1>
        <div className="flex space-x-4">
          <Link href="/bookings" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
            View All Bookings
          </Link>
          <Link href="/packages" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
            Buy Simulator Hours
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Book a Simulator</h2>
        <BookingForm onSuccess={() => {}} />
      </div>
      
      
    </div>
  )
}
