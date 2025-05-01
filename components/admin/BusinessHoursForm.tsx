import React, { useState, useEffect } from 'react'

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
          className="bg-simstudio-yellow hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg"
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

export default BusinessHoursForm
