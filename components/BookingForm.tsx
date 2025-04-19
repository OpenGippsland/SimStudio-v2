import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'

interface User {
  id: number;
  email: string;
  simulator_hours: number;
}

interface BookingFormProps {
  onSuccess?: () => void
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [businessHours, setBusinessHours] = useState<any[]>([])
  const [specialDates, setSpecialDates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    time: '',
    hours: 1,
    coach: 'none'
  })
  const [selectedUserCredits, setSelectedUserCredits] = useState<number | null>(null)
  const [attemptedClosedDate, setAttemptedClosedDate] = useState<string | null>(null)
  const [insufficientCredits, setInsufficientCredits] = useState(false)
  const [useFallbackDatePicker, setUseFallbackDatePicker] = useState(false)
  const [dateComponents, setDateComponents] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  })
  
  // Detect iOS devices and set fallback date picker automatically
  useEffect(() => {
    // Check if the device is iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setUseFallbackDatePicker(true);
    }
  }, []);
  
  // Fetch users, business hours, and special dates on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch users
        const usersResponse = await fetch('/api/users')
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users')
        }
        const usersData = await usersResponse.json()
        setUsers(usersData)
        
        // Fetch business hours
        const businessHoursResponse = await fetch('/api/business-hours')
        if (!businessHoursResponse.ok) {
          throw new Error('Failed to fetch business hours')
        }
        const businessHoursData = await businessHoursResponse.json()
        setBusinessHours(businessHoursData)
        
        // Fetch special dates
        const specialDatesResponse = await fetch('/api/special-dates')
        if (!specialDatesResponse.ok) {
          throw new Error('Failed to fetch special dates')
        }
        const specialDatesData = await specialDatesResponse.json()
        setSpecialDates(specialDatesData)
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Update selected user credits when user changes
  useEffect(() => {
    if (formData.userId) {
      const selectedUser = users.find(user => user.id.toString() === formData.userId)
      setSelectedUserCredits(selectedUser?.simulator_hours || 0)
    } else {
      setSelectedUserCredits(null)
    }
  }, [formData.userId, users])
  
  // Function to check if a date is closed
  const isDateClosed = useMemo(() => {
    return (dateString: string) => {
      // Parse the date
      const date = new Date(dateString)
      const dayOfWeek = date.getDay()
      const formattedDate = dateString.split('T')[0]
      
      console.log('Checking date:', formattedDate, 'Day of week:', dayOfWeek)
      
      // Check if it's a special date
      const specialDate = specialDates.find(sd => sd.date === formattedDate)
      if (specialDate) {
        console.log('Special date found:', specialDate)
        return specialDate.is_closed === 1
      }
      
      // Check regular business hours
      const dayHours = businessHours.find(bh => bh.day_of_week === dayOfWeek)
      console.log('Business hours for day:', dayHours)
      
      // Weekend check (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log('Weekend detected, should be closed')
        return true
      }
      
      return dayHours ? dayHours.is_closed === 1 : false
    }
  }, [businessHours, specialDates])
  
  // Function to disable dates in the date picker
  const disableDates = (e: React.FocusEvent<HTMLInputElement>) => {
    // This function will be called when the date input is focused
    // We'll add a change event listener to check each date as it's selected
    const input = e.target
    
    // Add a change event listener to validate the selected date
    input.addEventListener('input', () => {
      const selectedDate = input.value
      
      if (selectedDate && isDateClosed(selectedDate)) {
        // If the selected date is closed, add a CSS class to gray it out
        input.classList.add('date-closed')
        // Also set the attempted closed date state
        setAttemptedClosedDate(selectedDate)
      } else {
        // Otherwise, remove the CSS class
        input.classList.remove('date-closed')
        // And clear the attempted closed date
        setAttemptedClosedDate(null)
      }
    })
  }

  const coaches = [
    {id: 'any', name: 'Any coach'},
    {id: 'none', name: 'None'},
    {id: 'CB', name: 'CB'},
    {id: 'AD', name: 'AD'},
    {id: 'Sarkit', name: 'Sarkit'},
    {id: 'Fuck Face', name: 'Fuck Face'}
  ]
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    // Special handling for date field to prevent selecting closed dates
    if (name === 'date' && value && isDateClosed(value)) {
      // If the selected date is closed, set it as attempted closed date
      setAttemptedClosedDate(value)
      // Don't update the form data
      return
    } else if (name === 'date') {
      // Clear attempted closed date if a valid date is selected
      setAttemptedClosedDate(null)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Check for query parameters from cart redirect
  useEffect(() => {
    if (router.query.fromCheckout && router.query.userId) {
      // Set form data from query parameters
      setFormData(prev => ({
        ...prev,
        userId: router.query.userId as string,
        date: router.query.date as string || prev.date,
        time: router.query.time as string || prev.time,
        hours: router.query.hours ? parseInt(router.query.hours as string) : prev.hours,
        coach: router.query.coach as string || prev.coach
      }))
    }
  }, [router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)
    setInsufficientCredits(false)

    try {
      console.log('Form data on submit:', formData)
      if (!formData.date || formData.date === '') {
        throw new Error('Please select a date')
      }
      if (isDateClosed(formData.date)) {
        throw new Error('We are closed on the selected date. Please choose another date.')
      }
      if (!formData.time || formData.time === '') {
        throw new Error('Please select a time')
      }

      const [hours, minutes] = formData.time.split(':').map(Number)
      const startDate = new Date(formData.date)
      startDate.setHours(hours, minutes)
      const endDate = new Date(startDate.getTime() + formData.hours * 60 * 60 * 1000)

      // Check existing bookings for this time slot
      const bookingsResponse = await fetch('/api/bookings')
      const allBookings = await bookingsResponse.json()
      
      // Find first available simulator (1-4)
      let availableSimulator = 1
      const bookedSimulators = allBookings
        .filter((b: any) => {
          const bStart = new Date(b.start_time)
          const bEnd = new Date(b.end_time)
          return (startDate < bEnd && endDate > bStart)
        })
        .map((b: any) => b.simulator_id)

      while (bookedSimulators.includes(availableSimulator) && availableSimulator <= 4) {
        availableSimulator++
      }

      if (availableSimulator > 4) {
        throw new Error('No available simulators for selected time')
      }

      // Check if user is selected (logged in)
      if (!formData.userId) {
        // If no user is selected, redirect to cart page
        router.push({
          pathname: '/cart',
          query: {
            hours: formData.hours,
            date: formData.date,
            time: formData.time,
            coach: formData.coach
          }
        })
        return
      }
      
      // Check if user has enough credits
      const selectedUser = users.find(user => user.id.toString() === formData.userId)
      if (!selectedUser) {
        throw new Error('Selected user not found')
      }
      
      if (selectedUser.simulator_hours < formData.hours) {
        // If user doesn't have enough credits, redirect to cart page
        setInsufficientCredits(true)
        router.push({
          pathname: '/cart',
          query: {
            userId: formData.userId,
            hours: formData.hours,
            date: formData.date,
            time: formData.time,
            coach: formData.coach
          }
        })
        return
      }

      // If user has enough credits, create the booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: formData.userId,
          simulatorId: availableSimulator,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          coach: formData.coach
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create booking')
      }

      setSuccess(true)
      setFormData({
        userId: '',
        date: '',
        time: '',
        hours: 1,
        coach: 'none'
      })
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">New Booking</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">User</label>
        <select
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">No account / not logged in</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.email} (Credits: {user.simulator_hours} hours)
            </option>
          ))}
        </select>
      </div>
      
      {selectedUserCredits !== null && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="text-blue-800 font-medium">
            Available Credits: {selectedUserCredits} hours
          </p>
          {formData.hours > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              This booking will use {formData.hours} {formData.hours === 1 ? 'hour' : 'hours'}
            </p>
          )}
          {selectedUserCredits < formData.hours && (
            <p className="text-sm text-red-600 mt-1 font-medium">
              Warning: Not enough credits for this booking!
            </p>
          )}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Date</label>
        <div className="flex items-center mb-2">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onFocus={disableDates}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full p-2 border border-gray-300 rounded ${formData.date && isDateClosed(formData.date) ? 'date-closed' : ''}`}
            required={!useFallbackDatePicker}
            onKeyDown={(e) => e.preventDefault()} // Prevent manual entry
            // Add iOS-specific attributes
            pattern="\d{4}-\d{2}-\d{2}"
            placeholder="YYYY-MM-DD"
            disabled={useFallbackDatePicker}
          />
          <button 
            type="button" 
            onClick={() => setUseFallbackDatePicker(!useFallbackDatePicker)}
            className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {useFallbackDatePicker ? "Use Calendar" : "Having Issues?"}
          </button>
        </div>
        
        {useFallbackDatePicker ? (
          <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Select date using dropdown menus:</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Month</label>
                <select 
                  value={dateComponents.month}
                  onChange={(e) => {
                    const newMonth = parseInt(e.target.value);
                    setDateComponents(prev => ({...prev, month: newMonth}));
                    
                    // Update the formData.date
                    const newDate = new Date(dateComponents.year, newMonth - 1, dateComponents.day);
                    const dateString = newDate.toISOString().split('T')[0];
                    
                    if (!isDateClosed(dateString)) {
                      setFormData(prev => ({...prev, date: dateString}));
                    } else {
                      setAttemptedClosedDate(dateString);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Day</label>
                <select 
                  value={dateComponents.day}
                  onChange={(e) => {
                    const newDay = parseInt(e.target.value);
                    setDateComponents(prev => ({...prev, day: newDay}));
                    
                    // Update the formData.date
                    const newDate = new Date(dateComponents.year, dateComponents.month - 1, newDay);
                    const dateString = newDate.toISOString().split('T')[0];
                    
                    if (!isDateClosed(dateString)) {
                      setFormData(prev => ({...prev, date: dateString}));
                    } else {
                      setAttemptedClosedDate(dateString);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {Array.from(
                    {length: new Date(dateComponents.year, dateComponents.month, 0).getDate()}, 
                    (_, i) => i + 1
                  ).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Year</label>
                <select 
                  value={dateComponents.year}
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value);
                    setDateComponents(prev => ({...prev, year: newYear}));
                    
                    // Update the formData.date
                    const newDate = new Date(newYear, dateComponents.month - 1, dateComponents.day);
                    const dateString = newDate.toISOString().split('T')[0];
                    
                    if (!isDateClosed(dateString)) {
                      setFormData(prev => ({...prev, date: dateString}));
                    } else {
                      setAttemptedClosedDate(dateString);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {[new Date().getFullYear(), new Date().getFullYear() + 1].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected date: {formData.date ? new Date(formData.date).toLocaleDateString() : 'None'}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-500 mt-1">
            Select a date between {new Date().toLocaleDateString()} and {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}
          </p>
        )}
        
        {/* Display message if selected date is closed or attempted closed date */}
        {(formData.date && isDateClosed(formData.date) || attemptedClosedDate) && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
            <p className="text-red-600 font-medium">
              ⚠️ We are closed on this date. Please select another date.
            </p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Time (8am-6pm)</label>
        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Select time</option>
          {Array.from({length: 11}, (_, i) => {
            const hour = i + 8;
            return (
              <option key={hour} value={`${hour}:00`}>
                {hour}:00 - {hour + 1}:00
              </option>
            );
          })}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Duration</label>
        <select
          name="hours"
          value={formData.hours}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {[1, 2, 3, 4].map(hours => (
            <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Coach</label>
        <select
          name="coach"
          value={formData.coach}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {coaches.map(coach => (
            <option key={coach.id} value={coach.id}>
              {coach.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Booking created successfully!
        </div>
      )}

      {!success && (
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Processing...' : 
            !formData.userId ? 'Purchase and Checkout' : 
            selectedUserCredits !== null && selectedUserCredits < formData.hours ? 'Purchase Credits and Checkout' : 
            'Create Booking'
          }
        </button>
      )}
    </form>
  )
}
