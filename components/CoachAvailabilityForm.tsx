import React, { useState, useEffect } from 'react'

interface CoachProfile {
  id: number;
  user_id: string;
  hourly_rate: number;
  description: string;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    name: string;
    email: string;
  };
}

export default function CoachAvailabilityForm() {
  const [availability, setAvailability] = useState<any[]>([])
  const [coachId, setCoachId] = useState('')
  const [day, setDay] = useState(1)
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(17)
  const [message, setMessage] = useState('')
  const [newCoachId, setNewCoachId] = useState('')
  const [coaches, setCoaches] = useState<string[]>([])
  const [coachProfiles, setCoachProfiles] = useState<CoachProfile[]>([])

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/coach-availability?format=raw')
      const data = await res.json()
      setAvailability(data)
    } catch (error) {
      console.error('Error fetching coach availability:', error)
    }
  }

  const fetchCoachProfiles = async () => {
    try {
      const res = await fetch('/api/coach-profiles')
      const data = await res.json()
      setCoachProfiles(data)
      
      // Extract coach names from profiles
      const coachNames = data.map((profile: CoachProfile) => profile.users.name)
      setCoaches(coachNames)
      
      // Set default coach ID if available
      if (coachNames.length > 0 && !coachId) {
        setCoachId(coachNames[0])
      }
    } catch (error) {
      console.error('Error fetching coach profiles:', error)
    }
  }

  // This function is now disabled as coaches should be added through the admin panel
  const addCoach = () => {
    setMessage('Error: Coaches should be added through the Admin Panel > Coach Profiles')
  }
  
  // This function is now disabled as coaches should be managed through the admin panel
  const deleteCoach = async (coachToDelete: string) => {
    setMessage('Error: Coaches should be managed through the Admin Panel > Coach Profiles')
  }
  
  const deleteAvailability = async (id: number) => {
    try {
      const res = await fetch(`/api/coach-availability?id=${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setMessage('Availability deleted successfully')
        fetchAvailability()
      } else {
        const errorData = await res.json()
        setMessage(`Error: ${errorData.error || 'Failed to delete availability'}`)
      }
    } catch (error) {
      console.error('Error deleting availability:', error)
      setMessage('An error occurred while deleting availability')
    }
  }

  const addAvailability = async () => {
    setMessage('')
    
    try {
      const res = await fetch('/api/coach-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coachId,
          dayOfWeek: day,
          startHour,
          endHour
        })
      })
      
      if (res.ok) {
        setMessage('Coach availability added successfully')
        fetchAvailability()
      } else {
        const errorData = await res.json()
        setMessage(`Error: ${errorData.error || 'Failed to add coach availability'}`)
      }
    } catch (error) {
      console.error('Error adding coach availability:', error)
      setMessage('An error occurred while adding coach availability')
    }
  }

  useEffect(() => {
    fetchAvailability()
    fetchCoachProfiles()
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Coach Availability</h2>
      
      {/* Coach Management Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Coach Management</h3>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Add New Coach</h4>
          <div className="flex">
            <input
              type="text"
              value={newCoachId}
              onChange={(e) => setNewCoachId(e.target.value)}
              placeholder="Enter coach ID"
              className="flex-grow p-2 border border-gray-300 rounded-l"
            />
            <button
              onClick={addCoach}
              className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-r"
            >
              Add Coach
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Current Coaches</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {coaches.map((coach) => (
              <div key={coach} className="flex items-center justify-between p-2 bg-white border rounded">
                <span>{coach}</span>
                <button
                  onClick={() => deleteCoach(coach)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current Availability</h3>
        {availability.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Coach</th>
                <th className="p-2 text-left">Day</th>
                <th className="p-2 text-left">Hours</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((avail) => (
                <tr key={avail.id} className="border-b">
                  <td className="p-2">{avail.coach_id}</td>
                  <td className="p-2">
                    {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][avail.day_of_week]}
                  </td>
                  <td className="p-2">{avail.start_hour}:00 - {avail.end_hour}:00</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteAvailability(avail.id)}
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
          <p className="text-gray-500">No coach availability configured</p>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Set New Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Coach</label>
            <select 
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {coaches.map((coach) => (
                <option key={coach} value={coach}>{coach}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Day</label>
            <select 
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Start Hour</label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">End Hour</label>
            <select
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={addAvailability}
          className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg"
        >
          Add Availability
        </button>
        
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
