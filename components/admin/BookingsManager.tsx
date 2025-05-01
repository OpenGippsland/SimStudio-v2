import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BookingsManager() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      // Fetch all bookings for admin view (no user filter)
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

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Credits will be refunded to the user.')) {
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

  // Check if a booking is in the past
  const isPastBooking = (startTime: string) => {
    return new Date(startTime) < new Date()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">All Bookings</h2>
        <button 
          onClick={fetchBookings}
          className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg"
        >
          {loading ? 'Refreshing...' : 'Refresh Bookings'}
        </button>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">No bookings found in the system.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(bookingGroups).map(([date, dateBookings]) => (
            <div key={date} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h3 className="text-lg font-medium text-gray-800 p-4 bg-gray-50 border-b border-gray-200">
                {formatDateHeading(date)}
              </h3>
              <div className="p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">User</th>
                      <th className="p-2 text-left">Simulator</th>
                      <th className="p-2 text-left">Time</th>
                      <th className="p-2 text-left">Duration</th>
                      <th className="p-2 text-left">Coach</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateBookings.map(booking => (
                      <tr key={booking.id} className="border-b">
                        <td className="p-2">{booking.id}</td>
                        <td className="p-2">{booking.user_id}</td>
                        <td className="p-2">{booking.simulator_id}</td>
                        <td className="p-2">{formatDate(booking.start_time)}</td>
                        <td className="p-2">
                          {calculateDuration(booking.start_time, booking.end_time)} hour(s)
                        </td>
                        <td className="p-2">
                          {booking.coach && booking.coach !== 'none' ? booking.coach : '-'}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            isPastBooking(booking.start_time) 
                              ? 'bg-gray-100 text-gray-800' 
                              : booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isPastBooking(booking.start_time) ? 'Completed' : (booking.status || 'Confirmed')}
                          </span>
                        </td>
                        <td className="p-2">
                          {!isPastBooking(booking.start_time) && (
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              disabled={deleteLoading === booking.id}
                              className={`text-red-600 hover:text-red-800 ${
                                deleteLoading === booking.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {deleteLoading === booking.id ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
