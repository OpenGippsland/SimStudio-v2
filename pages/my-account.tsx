import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';
import PageHeader from '../components/layout/PageHeader';

const MyAccountPage = () => {
  const { user, authUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [coachProfile, setCoachProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [credits, setCredits] = useState<{ simulator_hours: number, coaching_sessions: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch user bookings
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

  // Fetch user credits
  const fetchCredits = async () => {
    if (!user) return;
    
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
    }
  };

  // Fetch coach profile if user is a coach
  const fetchCoachProfile = async () => {
    if (!user || !user.is_coach) return;
    
    try {
      const response = await fetch(`/api/coach-profiles?user_id=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setCoachProfile(data[0]);
        } else {
          // User is marked as coach but doesn't have a profile yet
          setCoachProfile(null);
        }
      } else {
        console.error('Failed to fetch coach profile');
      }
    } catch (error) {
      console.error('Error fetching coach profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchCredits();
      fetchCoachProfile();
      
      // Initialize form data with user info
      // Prefer user.name from the database over authUser.name from NextAuth
      const fullName = user?.name || authUser?.name || '';
      const nameParts = fullName.split(' ');
      
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        mobileNumber: user.mobile_number || ''
      });
    }
  }, [user, authUser]);

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
            {user?.is_coach && (
              <button
                onClick={() => setActiveTab('coach')}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'coach'
                    ? 'border-simstudio-yellow text-simstudio-yellow'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Coach Profile
              </button>
            )}
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
                <Link href="/booking" className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors">
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
                          className="relative bg-white overflow-hidden transform transition-all duration-200 border-2 border-simstudio-yellow"
                          style={{
                            borderTopLeftRadius: '38px',
                            borderBottomRightRadius: '38px'
                          }}
                        >
                          
                          {/* Card Header with Simulator ID and Duration */}
                          <div className="relative p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
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
                              <div className="text-gray-700 px-3 py-1.5 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {calculateDuration(booking.start_time, booking.end_time)} hour{calculateDuration(booking.start_time, booking.end_time) !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          {/* Card Body with Date and Status */}
                          <div className="p-5 bg-white">
                            <div className="mb-4 text-gray-700 p-3">
                              <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatDate(booking.start_time)}</span>
                              </div>
                              <div>
                                <a 
                                  href={generateCalendarLink(booking)}
                                  download={`simstudio-booking-${booking.id}.ics`}
                                  className="flex items-center text-gray-600 hover:text-gray-800 text-xs font-medium"
                                >
                                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  Add to calendar
                                </a>
                              </div>
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
                                <span className="inline-flex items-center text-gray-700 text-xs px-3 py-1.5">
                                  <svg className="w-3.5 h-3.5 mr-1 text-simstudio-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  Coach: {booking.coach}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Only show cancel button for future bookings */}
                          {new Date(booking.start_time) > new Date() && (
                            <div className="px-5 py-4 border-t border-gray-200">
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={deleteLoading === booking.id}
                                className={`w-full text-sm py-2 px-4 transition-all flex items-center justify-center ${
                                  deleteLoading === booking.id
                                    ? 'text-gray-500 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-700'
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
        
        {/* Coach Profile Tab Content */}
        {activeTab === 'coach' && user?.is_coach && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Coach Profile</h2>
              <Link 
                href="/coach-availability"
                className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Manage Availability
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading profile...</p>
              </div>
            ) : coachProfile ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Hourly Rate</p>
                    <p className="text-2xl font-bold text-simstudio-yellow">
                      ${coachProfile.hourly_rate.toFixed(2)}/hour
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 text-sm">Profile Created</p>
                    <p className="font-medium">
                      {new Date(coachProfile.created_at).toLocaleDateString('en-AU')}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">
                      {coachProfile.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Manage Your Coach Profile</h3>
                  <p className="text-gray-600 mb-4">
                    You can update your coach profile details, including hourly rate and description, through the admin panel.
                  </p>
                  <Link 
                    href="/admin"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors inline-block"
                  >
                    Go to Admin Panel
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Your coach profile is not set up yet.</p>
                <Link 
                  href="/admin"
                  className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Set Up Profile
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Account Information Tab Content */}
        {activeTab === 'account' && (
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Details
                </button>
              )}
            </div>
            
            {user && (
              <>
                {isEditing ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setUpdateLoading(true);
                    setMessage(null);
                    
                    try {
                      // Update user profile via API
                      const response = await fetch('/api/profile', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          firstName: formData.firstName,
                          lastName: formData.lastName,
                          email: formData.email,
                          mobileNumber: formData.mobileNumber,
                        }),
                      });
                      
                      if (response.ok) {
                        // Refresh user data and force a page reload
                        // This will update both the database and the NextAuth session
                        await refreshUser();
                        
                        // These settings will apply before the page reloads
                        setMessage({
                          type: 'success',
                          text: 'Account details updated successfully'
                        });
                        setIsEditing(false);
                      } else {
                        // Handle error response without throwing
                        const errorData = await response.json();
                        setMessage({
                          type: 'error',
                          text: errorData.error || 'Failed to update account details'
                        });
                      }
                    } catch (error) {
                      console.error('Error updating account:', error);
                      setMessage({
                        type: 'error',
                        text: 'Failed to update account details'
                      });
                    } finally {
                      setUpdateLoading(false);
                    }
                  }}>
                    {message && (
                      <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {message.text}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-simstudio-yellow focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-simstudio-yellow focus:border-transparent"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-simstudio-yellow focus:border-transparent"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          id="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                          placeholder="e.g. +61412345678"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-simstudio-yellow focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Please include country code (e.g. +61 for Australia)</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-6 rounded-lg transition-colors"
                      >
                        {updateLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setMessage(null);
                          // Reset form data with the latest user info
                          const fullName = user?.name || authUser?.name || '';
                          const nameParts = fullName.split(' ');
                          
                          setFormData({
                            firstName: nameParts[0] || '',
                            lastName: nameParts.slice(1).join(' ') || '',
                            email: user.email || '',
                            mobileNumber: user.mobile_number || ''
                          });
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {message && (
                      <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                        {message.text}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-600 text-sm">Name</p>
                        <p className="font-medium">{user?.name || authUser?.name || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      
                      <div className="md:col-span-2">
                        <p className="text-gray-600 text-sm">Mobile Number</p>
                        <p className="font-medium">{user.mobile_number || 'Not set'}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">Available Credits</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-600 text-sm mb-1">Simulator Hours</p>
                          <p className="text-2xl font-bold text-simstudio-yellow">
                            {credits?.simulator_hours || 0}
                          </p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-gray-600 text-sm mb-1">Coaching Sessions</p>
                          <p className="text-2xl font-bold text-simstudio-yellow">
                            {credits?.coaching_sessions || 0}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Link href="/packages" className="text-simstudio-yellow hover:text-yellow-600 font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Purchase More Credits
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
