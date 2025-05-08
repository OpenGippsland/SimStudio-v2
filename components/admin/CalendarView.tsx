import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer
const localizer = momentLocalizer(moment);

// Define event colors based on simulator
const simulatorColors = {
  1: '#4285F4', // Blue
  2: '#EA4335', // Red
  3: '#FBBC05', // Yellow
  4: '#34A853', // Green
  default: '#9E9E9E' // Grey
};

export default function CalendarView() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [view, setView] = useState('week');
  const [filters, setFilters] = useState({
    simulator: 'all',
    coach: 'all'
  });

  // Fetch bookings from API
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format bookings as calendar events
  const events = useMemo(() => {
    return bookings
      .filter(booking => {
        // Apply filters
        if (filters.simulator !== 'all' && booking.simulator_id.toString() !== filters.simulator) {
          return false;
        }
        if (filters.coach !== 'all' && booking.coach !== filters.coach) {
          return false;
        }
        return true;
      })
      .map(booking => {
        const simulatorId = booking.simulator_id;
        const userName = booking.user_name || `User ${booking.user_id}`;
        
        return {
          id: booking.id,
          title: `Sim #${simulatorId}: ${userName}`,
          start: new Date(booking.start_time),
          end: new Date(booking.end_time),
          resource: booking,
          // Add custom styling based on simulator
          style: {
            backgroundColor: simulatorColors[simulatorId] || simulatorColors.default,
            borderColor: simulatorColors[simulatorId] || simulatorColors.default,
          }
        };
      });
  }, [bookings, filters]);

  // Handle event selection
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };

  // Format date for display
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

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Credits will be refunded to the user.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`Booking cancelled successfully. ${data.refundedHours} hour(s) refunded.`);
        fetchBookings();
        setSelectedEvent(null);
      } else {
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred while cancelling the booking');
    }
  };

  // Check if a booking is in the past
  const isPastBooking = (startTime: string) => {
    return new Date(startTime) < new Date();
  };

  // Get unique coaches for filter
  const coaches = useMemo(() => {
    const uniqueCoaches = new Set<string>();
    bookings.forEach(booking => {
      if (booking.coach && booking.coach !== 'none') {
        uniqueCoaches.add(booking.coach);
      }
    });
    return Array.from(uniqueCoaches);
  }, [bookings]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Booking Calendar</h2>
        <button 
          onClick={fetchBookings}
          className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg"
        >
          {loading ? 'Refreshing...' : 'Refresh Calendar'}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label htmlFor="simulator-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Simulator
          </label>
          <select
            id="simulator-filter"
            value={filters.simulator}
            onChange={(e) => setFilters({...filters, simulator: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Simulators</option>
            <option value="1">Simulator 1</option>
            <option value="2">Simulator 2</option>
            <option value="3">Simulator 3</option>
            <option value="4">Simulator 4</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="coach-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Coach
          </label>
          <select
            id="coach-filter"
            value={filters.coach}
            onChange={(e) => setFilters({...filters, coach: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Coaches</option>
            {coaches.map(coach => (
              <option key={coach} value={coach}>{coach}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="view-selector" className="block text-sm font-medium text-gray-700 mb-1">
            View
          </label>
          <select
            id="view-selector"
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-6" style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          view={view as any}
          onView={(newView) => setView(newView)}
          eventPropGetter={(event) => ({
            style: event.style
          })}
          defaultDate={new Date()}
        />
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Booking Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="font-medium">{selectedEvent.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-medium">{selectedEvent.user_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Simulator</p>
              <p className="font-medium">{selectedEvent.simulator_id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Start Time</p>
              <p className="font-medium">{formatDate(selectedEvent.start_time)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">End Time</p>
              <p className="font-medium">{formatDate(selectedEvent.end_time)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-medium">
                {calculateDuration(selectedEvent.start_time, selectedEvent.end_time)} hour(s)
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Coach</p>
              <p className="font-medium">
                {selectedEvent.coach && selectedEvent.coach !== 'none' ? selectedEvent.coach : '-'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">
                <span className={`px-2 py-1 rounded text-xs ${
                  isPastBooking(selectedEvent.start_time) 
                    ? 'bg-gray-100 text-gray-800' 
                    : selectedEvent.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isPastBooking(selectedEvent.start_time) ? 'Completed' : (selectedEvent.status || 'Confirmed')}
                </span>
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            {!isPastBooking(selectedEvent.start_time) && (
              <button
                onClick={() => handleCancelBooking(selectedEvent.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
