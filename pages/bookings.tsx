import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      
      // Filter out past bookings
      const now = new Date()
      const futureBookings = data.filter((booking: any) => {
        return new Date(booking.start_time) > now
      })
      
      // Sort bookings by date then time
      const sortedBookings = futureBookings.sort((a: any, b: any) => {
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

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Your credits will be refunded.')) {
      return
    }
    
    setDeleteLoading(bookingId)
    setMessage(null)
    
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Booking cancelled successfully. ${data.refundedHours} hour${data.refundedHours !== 1 ? 's' : ''} refunded.` 
        })
        fetchBookings()
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to cancel booking' 
        })
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      setMessage({ 
        type: 'error', 
        text: 'An error occurred while cancelling the booking' 
      })
    } finally {
      setDeleteLoading(null)
    }
  }

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
  
  // Format date for display in headings
  const formatDateHeading = (dateString: string) => {
    // Parse Australian date format (DD/MM/YYYY)
    const parts = dateString.split('/')
    if (parts.length !== 3) return dateString
    
    // Create date with year, month (0-based), day
    const date = new Date(
      parseInt(parts[2]), // year
      parseInt(parts[1]) - 1, // month (0-based)
      parseInt(parts[0]) // day
    )
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

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
        <h2 className="text-2xl font-semibold text-gray-700">Upcoming Bookings</h2>
        <button 
          onClick={fetchBookings}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          {loading ? 'Refreshing...' : 'Refresh Bookings'}
        </button>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
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
              <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">{formatDateHeading(date)}</h3>
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
                    
                    {/* Only show cancel button for future bookings */}
                    {new Date(booking.start_time) > new Date() && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          disabled={deleteLoading === booking.id}
                          className={`w-full text-sm py-1.5 px-3 rounded ${
                            deleteLoading === booking.id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {deleteLoading === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      </div>
                    )}
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
