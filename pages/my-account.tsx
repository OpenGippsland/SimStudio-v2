import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';

const MyAccountPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings?userId=${user.id}`);
      const data = await response.json();
      
      // Filter out past bookings
      const now = new Date();
      const futureBookings = data.filter((booking: any) => {
        return new Date(booking.start_time) > now;
      });
      
      // Sort bookings by date then time
      const sortedBookings = futureBookings.sort((a: any, b: any) => {
        const dateA = new Date(a.start_time).getTime();
        const dateB = new Date(b.start_time).getTime();
        return dateA - dateB;
      });
      setBookings(sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Your credits will be refunded.')) {
      return;
    }
    
    setDeleteLoading(bookingId);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Booking cancelled successfully. ${data.refundedHours} hour${data.refundedHours !== 1 ? 's' : ''} refunded.` 
        });
        fetchBookings();
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Failed to cancel booking' 
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setMessage({ 
        type: 'error', 
        text: 'An error occurred while cancelling the booking' 
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Calculate duration in hours
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return Math.round((end - start) / (60 * 60 * 1000));
  };

  // Group bookings by date for better organization
  const groupBookingsByDate = () => {
    const groups: { [key: string]: any[] } = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.start_time).toLocaleDateString('en-AU');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(booking);
    });
    
    return groups;
  };

  const bookingGroups = groupBookingsByDate();
  
  // Format date for display in headings
  const formatDateHeading = (dateString: string) => {
    // Parse Australian date format (DD/MM/YYYY)
    const parts = dateString.split('/');
    if (parts.length !== 3) return dateString;
    
    // Create date with year, month (0-based), day
    const date = new Date(
      parseInt(parts[2]), // year
      parseInt(parts[1]) - 1, // month (0-based)
      parseInt(parts[0]) // day
    );
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Generate calendar link for adding to user's calendar
  const generateCalendarLink = (booking: any) => {
    // Format dates for iCalendar format (YYYYMMDDTHHMMSSZ)
    const formatICSDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startTime = formatICSDate(booking.start_time);
    const endTime = formatICSDate(booking.end_time);
    const duration = calculateDuration(booking.start_time, booking.end_time);
    const coachInfo = booking.coach && booking.coach !== 'none' ? ` with Coach ${booking.coach}` : '';
    
    // Create event details
    const event = {
      title: `SimStudio Simulator ${booking.simulator_id} Booking${coachInfo}`,
      description: `Your ${duration} hour simulator session${coachInfo}. Booking #${booking.id}`,
      location: 'SimStudio Melbourne',
      start: startTime,
      end: endTime
    };
    
    // Generate iCalendar format
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    // Encode the iCalendar content for use in a data URL
    const encodedContent = encodeURIComponent(icsContent);
    return `data:text/calendar;charset=utf-8,${encodedContent}`;
  };

  return (
    <>
      <Head>
        <title>My Account | SimStudio</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 heading-font">My Account</h1>
        
        {/* Account Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'bookings'
                  ? 'border-simstudio-yellow text-simstudio-yellow'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'account'
                  ? 'border-simstudio-yellow text-simstudio-yellow'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Account Information
            </button>
          </nav>
        </div>
        
        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <div>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Upcoming Bookings</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={fetchBookings}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                <Link href="/" className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors">
                  New Booking
                </Link>
              </div>
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
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                <p className="text-gray-600 mb-4">You don't have any upcoming bookings.</p>
                <Link href="/" className="text-simstudio-yellow hover:text-yellow-600 font-medium">
                  Create your first booking
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(bookingGroups).map(([date, dateBookings]) => (
                  <div key={date} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-lg font-medium text-gray-800 p-4 border-b border-gray-100">
                      {formatDateHeading(date)}
                    </h3>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dateBookings.map(booking => (
                        <div 
                          key={booking.id}
                          className="bg-gray-50 rounded-lg shadow-md overflow-hidden transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-4 border-simstudio-yellow"
                        >
                          {/* Card Header with Simulator ID and Duration */}
                          <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <svg className="w-10 h-10 mr-3 text-gray-700" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M7 7L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M17 7L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M7 17L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M17 17L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <div>
                                  <div className="font-semibold text-gray-800">
                                    Simulator {booking.simulator_id}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Booking #{booking.id}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white shadow-sm text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {calculateDuration(booking.start_time, booking.end_time)} hour{calculateDuration(booking.start_time, booking.end_time) !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          {/* Card Body with Date and Status */}
                          <div className="p-5 bg-white">
                            <div className="flex items-center justify-between mb-4 text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-200">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(booking.start_time)}</span>
                              </div>
                              <a 
                                href={generateCalendarLink(booking)}
                                download={`simstudio-booking-${booking.id}.ics`}
                                className="flex items-center text-gray-600 hover:text-gray-800 text-xs font-medium"
                              >
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add
                              </a>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-gray-600 text-sm">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Booking confirmed
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              {booking.coach && booking.coach !== 'none' && (
                                <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                                  <svg className="w-3.5 h-3.5 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  Coach: {booking.coach}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Only show cancel button for future bookings */}
                          {new Date(booking.start_time) > new Date() && (
                            <div className="px-5 py-4 bg-gray-100 border-t border-gray-200">
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={deleteLoading === booking.id}
                                className={`w-full text-sm py-2 px-4 rounded-md transition-all flex items-center justify-center ${
                                  deleteLoading === booking.id
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 shadow-sm'
                                }`}
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
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
        )}
        
        {/* Account Information Tab Content */}
        {activeTab === 'account' && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
            
            {user && (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                {/* More account information can be added here in the future */}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default function MyAccount() {
  return (
    <AuthGuard>
      <MyAccountPage />
    </AuthGuard>
  );
}
