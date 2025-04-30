import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import PackageManager from '../components/PackageManager'
import UserCreditsManager from '../components/UserCreditsManager'
import CoachAvailabilityForm from '../components/CoachAvailabilityForm'

// Business Hours Form Component
const BusinessHoursForm = () => {
  const [businessHours, setBusinessHours] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState(1)
  const [openHour, setOpenHour] = useState(8)
  const [closeHour, setCloseHour] = useState(18)
  const [isClosed, setIsClosed] = useState(false)
  const [message, setMessage] = useState('')

  const fetchBusinessHours = async () => {
    try {
      const res = await fetch('/api/business-hours')
      const data = await res.json()
      setBusinessHours(data)
    } catch (error) {
      console.error('Error fetching business hours:', error)
    }
  }

  useEffect(() => {
    fetchBusinessHours()
  }, [])

  useEffect(() => {
    // When a day is selected, populate the form with its values if they exist
    const dayData = businessHours.find(hour => hour.day_of_week === selectedDay)
    if (dayData) {
      setOpenHour(dayData.open_hour)
      setCloseHour(dayData.close_hour)
      setIsClosed(dayData.is_closed === 1)
    } else {
      // Default values
      setOpenHour(8)
      setCloseHour(18)
      setIsClosed(false)
    }
  }, [selectedDay, businessHours])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('/api/business-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dayOfWeek: selectedDay,
          openHour,
          closeHour,
          isClosed
        })
      })

      if (res.ok) {
        setMessage('Business hours updated successfully')
        fetchBusinessHours()
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error || 'Failed to update business hours'}`)
      }
    } catch (error) {
      console.error('Error updating business hours:', error)
      setMessage('An error occurred while updating business hours')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Hours</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current Hours</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Day</th>
              <th className="p-2 text-left">Hours</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {businessHours.map((hour) => (
              <tr key={hour.day_of_week} className="border-b">
                <td className="p-2">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][hour.day_of_week]}
                </td>
                <td className="p-2">
                  {hour.is_closed ? 'Closed' : `${hour.open_hour}:00 - ${hour.close_hour}:00`}
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${hour.is_closed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {hour.is_closed ? 'Closed' : 'Open'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Open Hour</label>
            <select
              value={openHour}
              onChange={(e) => setOpenHour(Number(e.target.value))}
              disabled={isClosed}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Close Hour</label>
            <select
              value={closeHour}
              onChange={(e) => setCloseHour(Number(e.target.value))}
              disabled={isClosed}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">Closed</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Update Business Hours
        </button>
        
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}

// Special Dates Form Component
const SpecialDatesForm = () => {
  const [specialDates, setSpecialDates] = useState<any[]>([])
  const [date, setDate] = useState('')
  const [isClosed, setIsClosed] = useState(true)
  const [openHour, setOpenHour] = useState<number | null>(null)
  const [closeHour, setCloseHour] = useState<number | null>(null)
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const fetchSpecialDates = async () => {
    try {
      const res = await fetch('/api/special-dates')
      const data = await res.json()
      setSpecialDates(data)
    } catch (error) {
      console.error('Error fetching special dates:', error)
    }
  }

  useEffect(() => {
    fetchSpecialDates()
  }, [])

  // When isClosed changes, reset hours if needed
  useEffect(() => {
    if (isClosed) {
      setOpenHour(null)
      setCloseHour(null)
    }
  }, [isClosed])

  // When one hour changes, ensure consistency
  useEffect(() => {
    // If one is set and the other is null, set default for the null one
    if (openHour !== null && closeHour === null) {
      setCloseHour(18) // Default close hour
    } else if (openHour === null && closeHour !== null) {
      setOpenHour(8) // Default open hour
    }
  }, [openHour, closeHour])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!date) {
      setMessage('Error: Date is required')
      return
    }

    // Validate hours if not closed
    if (!isClosed) {
      // If one is set and the other is null, set default values
      let finalOpenHour = openHour
      let finalCloseHour = closeHour
      
      if (openHour === null && closeHour === null) {
        // Both null is fine - will use default hours
      } else if (openHour === null) {
        finalOpenHour = 8 // Default open hour
      } else if (closeHour === null) {
        finalCloseHour = 18 // Default close hour
      }
      
      // Validate hours
      if (finalOpenHour !== null && finalCloseHour !== null && finalOpenHour >= finalCloseHour) {
        setMessage('Error: Open hour must be before close hour')
        return
      }
    }

    try {
      const res = await fetch('/api/special-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date,
          isClosed,
          openHour: !isClosed ? openHour : null,
          closeHour: !isClosed ? closeHour : null,
          description
        })
      })

      if (res.ok) {
        setMessage('Special date added successfully')
        setDate('')
        setIsClosed(true)
        setOpenHour(null)
        setCloseHour(null)
        setDescription('')
        fetchSpecialDates()
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error || 'Failed to add special date'}`)
      }
    } catch (error) {
      console.error('Error adding special date:', error)
      setMessage('An error occurred while adding special date')
    }
  }

  const handleDelete = async (date: string) => {
    try {
      const res = await fetch(`/api/special-dates?date=${date}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchSpecialDates()
      } else {
        const error = await res.json()
        setMessage(`Error: ${error.error || 'Failed to delete special date'}`)
      }
    } catch (error) {
      console.error('Error deleting special date:', error)
      setMessage('An error occurred while deleting special date')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Dates</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current Special Dates</h3>
        {specialDates.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Hours</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialDates.map((specialDate) => (
                <tr key={specialDate.date} className="border-b">
                  <td className="p-2">{specialDate.date}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${specialDate.is_closed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {specialDate.is_closed ? 'Closed' : 'Open'}
                    </span>
                  </td>
                  <td className="p-2">
                    {specialDate.is_closed ? 'Closed' : 
                      (specialDate.open_hour !== null && specialDate.close_hour !== null) ? 
                        `${specialDate.open_hour}:00 - ${specialDate.close_hour}:00` : 
                        'Default Hours'
                    }
                  </td>
                  <td className="p-2">{specialDate.description || '-'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(specialDate.date)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No special dates configured</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">Closed</span>
            </label>
          </div>
        </div>
        
        {!isClosed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Open Hour</label>
              <select
                value={openHour || ''}
                onChange={(e) => setOpenHour(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Use Default</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}:00</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Close Hour</label>
              <select
                value={closeHour || ''}
                onChange={(e) => setCloseHour(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Use Default</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}:00</option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Christmas Day, Public Holiday"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          Add Special Date
        </button>
        
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}

// Main Admin Page
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link href="/" className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg">
            Back to Home
          </Link>
        </div>
        
        
        <div className="mb-8">
          <BusinessHoursForm />
        </div>
        
        <div className="mb-8">
          <SpecialDatesForm />
        </div>
        
        <div className="mb-8">
          <PackageManager />
        </div>
        
        <div className="mb-8">
          <UserCreditsManager />
        </div>
        
        <div className="mb-8">
          <CoachAvailabilityForm />
        </div>
      </div>
    </div>
  )
}
