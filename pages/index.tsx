import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import BookingForm from '../components/BookingForm'

export default function Home() {
  const [bookings, setBookings] = useState<any[]>([])

  const fetchBookings = async () => {
    const response = await fetch('/api/bookings')
      const data = await response.json()
      // Sort bookings by date then time
      const sortedBookings = data.sort((a: any, b: any) => {
        const dateA = new Date(a.start_time).getTime()
        const dateB = new Date(b.start_time).getTime()
        return dateA - dateB
      })
      setBookings(sortedBookings)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sim Studio Booking System</h1>
        <Link href="/packages" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
          Buy Simulator Hours
        </Link>
      </div>
      <BookingForm onSuccess={fetchBookings} />
      <button 
        onClick={fetchBookings}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg mb-6"
      >
        Refresh Bookings
      </button>
      <ul className="space-y-2">
        {bookings.map(booking => (
          <li 
            key={booking.id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="font-medium">Simulator {booking.simulator_id}</div>
            <div className="text-gray-600">
              {new Date(booking.start_time).toLocaleString()} 
              ({Math.round((new Date(booking.end_time).getTime() - new Date(booking.start_time).getTime()) / (60 * 60 * 1000))} hr)
            </div>
            {booking.coach !== 'none' && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                Coach: {booking.coach}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
