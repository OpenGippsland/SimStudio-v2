import React, { useState, useEffect } from 'react'

export default function CoachAvailability() {
  const [availability, setAvailability] = useState<any[]>([])
  const [coachId, setCoachId] = useState('CB')
  const [day, setDay] = useState(1)
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(17)

  const fetchAvailability = async () => {
    const res = await fetch('/api/coach-availability')
    const data = await res.json()
    setAvailability(data)
  }

  const addAvailability = async () => {
    await fetch('/api/coach-availability', {
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
    fetchAvailability()
  }

  useEffect(() => {
    fetchAvailability()
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
              <option value="CB">CB</option>
              <option value="AD">AD</option>
              <option value="Sarkit">Sarkit</option>
              <option value="Fuck Face">Fuck Face</option>
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
            <input
              type="number"
              min="0"
              max="23"
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">End Hour</label>
            <input
              type="number"
              min="0"
              max="23"
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={addAvailability}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Availability
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Current Availability</h2>
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
      </div>
    </div>
  )
}
