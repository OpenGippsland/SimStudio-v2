import React, { useState, useEffect } from 'react'

export default function CoachAvailabilityForm() {
  const [availability, setAvailability] = useState<any[]>([])
  const [coachId, setCoachId] = useState('CB')
  const [day, setDay] = useState(1)
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(17)
  const [message, setMessage] = useState('')

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/coach-availability')
      const data = await res.json()
      setAvailability(data)
    } catch (error) {
      console.error('Error fetching coach availability:', error)
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
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Coach Availability</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Current Availability</h3>
        {availability.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Coach</th>
                <th className="p-2 text-left">Day</th>
                <th className="p-2 text-left">Hours</th>
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
              <option value="CB">CB</option>
              <option value="AD">AD</option>
              <option value="Sarkit">Sarkit</option>
              <option value="Fuck Face">Fuck Face</option>
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
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
