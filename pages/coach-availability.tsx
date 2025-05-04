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

export default function CoachAvailability() {
  const [availability, setAvailability] = useState<any[]>([])
  const [coachId, setCoachId] = useState('')
  const [day, setDay] = useState(1)
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(17)
  const [coachProfiles, setCoachProfiles] = useState<CoachProfile[]>([])
  const [message, setMessage] = useState('')

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
      
      // Set default coach ID if available
      if (data.length > 0 && !coachId) {
        setCoachId(data[0].users.name)
      }
    } catch (error) {
      console.error('Error fetching coach profiles:', error)
    }
  }

  const addAvailability = async () => {
    if (!coachId) {
      setMessage('Please select a coach')
      return
    }
    
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Coach Availability</h1>
      
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Set New Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2">Coach</label>
            <select 
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {coachProfiles.length === 0 ? (
                <option value="">No coaches available</option>
              ) : (
                coachProfiles.map((profile) => (
                  <option key={profile.id} value={profile.users.name}>
                    {profile.users.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block mb-2">Day</label>
            <select 
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full p-2 border rounded"
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
            <label className="block mb-2">Start Hour</label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">End Hour</label>
            <select
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}:00</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={addAvailability}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Availability
        </button>
        
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Current Availability</h2>
        {availability.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Coach</th>
                <th className="p-3 text-left">Day</th>
                <th className="p-3 text-left">Hours</th>
              </tr>
            </thead>
            <tbody>
              {availability.map((avail) => (
                <tr key={avail.id} className="border-b">
                  <td className="p-3">{avail.coach_id}</td>
                  <td className="p-3">
                    {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][avail.day_of_week]}
                  </td>
                  <td className="p-3">{avail.start_hour}:00 - {avail.end_hour}:00</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-gray-500">No coach availability configured</p>
        )}
      </div>
    </div>
  )
}
