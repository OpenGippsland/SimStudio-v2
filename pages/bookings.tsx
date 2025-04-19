import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      // Sort bookings by date then time
      const sortedBookings = data.sort((a: any, b: any) => {
        const dateA = new Date(a.start_time).getTime()
        const dateB = new Date(b.start_time).getTime()
        return dateA - dateB
      })
      setBookings(sortedBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }

  // Calculate duration in hours
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    return Math.round((end - start) / (60 * 60 * 1000))
  }

  // Group bookings by date for better organization
  const groupBookingsByDate = () => {
    const groups: { [key: string]: any[] } = {}
    
    bookings.forEach(booking => {
      const date = new Date(booking.start_time).toLocaleDateString('en-AU')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(booking)
    })
    
    return groups
  }

  const bookingGroups = groupBookingsByDate()

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>SimStudio - Bookings</title>
      </Head>
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Simulator Bookings</h1>
        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg">
          Create New Booking
        </Link>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-700">Current Bookings</h2>
        <button 
          onClick={fetchBookings}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          {loading ? 'Refreshing...' : 'Refresh Bookings'}
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">No bookings found. <Link href="/" className="text-blue-600 hover:underline">Create your first booking</Link>.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(bookingGroups).map(([date, dateBookings]) => (
            <div key={date} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">{date}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateBookings.map(booking => (
                  <div 
                    key={booking.id}
                    className="bg-gray-50 p-4 rounded-md border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-blue-700">Simulator {booking.simulator_id}</div>
                      <div className="text-sm text-gray-500">
                        {calculateDuration(booking.start_time, booking.end_time)} hour{calculateDuration(booking.start_time, booking.end_time) !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2">
                      {formatDate(booking.start_time)}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {booking.coach && booking.coach !== 'none' && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Coach: {booking.coach}
                        </span>
                      )}
                      <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status || 'confirmed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
